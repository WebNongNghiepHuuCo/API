import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { MailService } from '~/mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDetail, OrderDetailDocument } from './order-detail.schema';
import PaginationHelper, { PaginationResponse } from '~/helpers/pagination.helper';
import { AppResponse } from '~/common/interfaces';
import { FindPaginateOrderDetail } from './dto/find-paginate-order-details.dto';
import { escapeRegex } from '~/helpers';
import { EOrderDetailStatus } from '~/constants/orderdetail.constant';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectModel(OrderDetail.name) readonly orderDetailModel: Model<OrderDetailDocument>,
    private mailService: MailService,
  ) {}

  async findByField(filter: object): Promise<OrderDetail | Observable<never>> {
    const orderDetail = await this.orderDetailModel.findOne(filter);

    if (!orderDetail) {
      throw new BadRequestException('orderDetail not exist');
    }

    return orderDetail;
  }

  async findPaginateOrder(dto: FindPaginateOrderDetail): Promise<AppResponse<PaginationResponse<OrderDetail>>> {
    const { page, perPage, match, skip } = PaginationHelper.getQueryByPagination<OrderDetail, FindPaginateOrderDetail>(dto);

    const { fullname } = dto;

    if (fullname) {
      match.fullname = { $regex: new RegExp(escapeRegex(fullname), 'i') };
    }

    const [orderDetail, count] = await Promise.all([
      this.orderDetailModel.find(match).sort({ createdAt: 'desc' }).limit(perPage).skip(skip),
      this.orderDetailModel.countDocuments(match),
    ]);
    return {
      content: PaginationHelper.getPaginationResponse({ page: page, data: orderDetail, perPage: perPage, total: count }),
    };
  }

  async findOne(id: string): Promise<AppResponse<OrderDetail> | Observable<never>> {
    const orderDetail = await this.findByField({ _id: id });

    if (orderDetail instanceof Observable) {
      return orderDetail;
    }

    return {
      content: orderDetail,
    };
  }

  async update(id: string): Promise<AppResponse<OrderDetail | null> | Observable<never>> {
    const orderDetail = await this.findByField({ _id: id });

    if (orderDetail instanceof Observable) {
      return orderDetail;
    }

    const data: any = {
      status: EOrderDetailStatus.RESOLVED,
    };

    // await this.mailService.confirmOrder(orderDetail?.email);
    
    return {
      content: await this.orderDetailModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ),
    };
  }

  async remove(id: string) {
    const orderDetail = await this.orderDetailModel.findOne({
      _id: id,
    });

    if (!orderDetail) {
      throw new BadRequestException('Order not found');
    }

    return {
      content: await this.orderDetailModel.findByIdAndRemove({ _id: id }),
    };
  }
}
