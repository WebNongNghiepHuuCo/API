import { Controller, Get, Put, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FindPaginateOrder } from './dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Order } from './order.schema';
import { AppResponse } from '~/common/interfaces';
import { PaginationResponse } from '~/helpers';
import { Observable } from 'rxjs';
import { IdDto } from '~/common/dto';
import { EAccountRole } from '~/constants';
import { Authorize, Roles } from '~/decorators';
import { JwtAuthGuard, RolesGuard } from '~/guards';

@ApiTags('[Admin] - Order')
@Roles(EAccountRole.ADMIN)
@Authorize()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get paginate order',
  })
  @ApiOkResponse({ type: Order })
  findPaginateProducts(@Query() dto: FindPaginateOrder): Promise<AppResponse<PaginationResponse<Order>>> {
    return this.ordersService.findPaginateOrder(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detail oreder',
  })
  findOne(@Param() id: IdDto): Promise<AppResponse<Order> | Observable<never>> {
    return this.ordersService.findOne(id.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update order',
  })
  update(@Param() id: IdDto): Promise<AppResponse<Order | null> | Observable<never>> {
    return this.ordersService.update(id.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete order',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
