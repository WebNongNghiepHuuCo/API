import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OrderDetail } from './order-detail.schema';
import { FindPaginateOrderDetail } from './dto/find-paginate-order-details.dto';
import { AppResponse } from '~/common/interfaces';
import { PaginationResponse } from '~/helpers';
import { Observable } from 'rxjs';
import { IdDto } from '~/common/dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get paginate order',
  })
  @ApiOkResponse({ type: OrderDetail })
  findPaginateProducts(@Query() dto: FindPaginateOrderDetail): Promise<AppResponse<PaginationResponse<OrderDetail>>> {
    return this.orderDetailsService.findPaginateOrder(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detail oreder',
  })
  findOne(@Param() id: IdDto): Promise<AppResponse<OrderDetail> | Observable<never>> {
    return this.orderDetailsService.findOne(id.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update order',
  })
  update(@Param() id: IdDto): Promise<AppResponse<OrderDetail | null> | Observable<never>> {
    return this.orderDetailsService.update(id.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete order',
  })
  remove(@Param('id') id: string) {
    return this.orderDetailsService.remove(id);
  }
}
