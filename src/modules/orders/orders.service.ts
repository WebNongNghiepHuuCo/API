import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import { FindPaginateOrder } from './dto';
import PaginationHelper from '~/helpers/pagination.helper';
import { AppResponse, PaginationResponse } from '~/common/interfaces';
import { escapeRegex } from '~/helpers';
import { Observable } from 'rxjs';
import { EOrderStatus } from '~/constants';
import { MailService } from '~/mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) readonly orderModel: Model<OrderDocument>,
    private mailService: MailService,
  ) {}

  async findByField(filter: object): Promise<Order | Observable<never>> {
    const order = await this.orderModel.findOne(filter);

    if (!order) {
      throw new BadRequestException('Order not exist');
    }

    return order;
  }

  async findPaginateOrder(dto: FindPaginateOrder): Promise<AppResponse<PaginationResponse<Order>>> {
    const { page, perPage, match, skip } = PaginationHelper.getQueryByPagination<Order, FindPaginateOrder>(dto);

    const { fullname } = dto;

    if (fullname) {
      match.fullname = { $regex: new RegExp(escapeRegex(fullname), 'i') };
    }

    const [order, count] = await Promise.all([
      this.orderModel.find(match).sort({ createdAt: 'desc' }).limit(perPage).skip(skip),
      this.orderModel.countDocuments(match),
    ]);
    return {
      content: PaginationHelper.getPaginationResponse({ page: page, data: order, perPage: perPage, total: count }),
    };
  }

  async findOne(id: string): Promise<AppResponse<Order> | Observable<never>> {
    const order = await this.findByField({ _id: id });

    if (order instanceof Observable) {
      return order;
    }

    return {
      content: order,
    };
  }

  async update(id: string): Promise<AppResponse<Order | null> | Observable<never>> {
    const order = await this.findByField({ _id: id });

    if (order instanceof Observable) {
      return order;
    }

    const data: any = {
      status: EOrderStatus.RESOLVED,
    };

    await this.mailService.confirmOrder(order?.email);
    
    return {
      content: await this.orderModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ),
    };
  }

  async remove(id: string) {
    const order = await this.orderModel.findOne({
      _id: id,
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return {
      content: await this.orderModel.findByIdAndRemove({ _id: id }),
    };
  }
}
