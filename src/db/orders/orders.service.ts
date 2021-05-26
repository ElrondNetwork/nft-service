import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusType } from './order-status.enum';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrdersServiceDb {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  async getActiveOrdersForAuction(auctionId: number): Promise<OrderEntity> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .where(`order.auction_id = :id and order.status='active'`, {
        id: auctionId,
      })
      .getOne();
  }

  async getOrdersForAuction(auctionId: number): Promise<OrderEntity[]> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.auction_id = :id', {
        id: auctionId,
      })
      .getMany();
  }

  async saveOrder(order: OrderEntity) {
    order.status = OrderStatusType.active;
    return await this.ordersRepository.save(order);
  }

  async updateOrder(order: OrderEntity) {
    order.status = OrderStatusType.inactive;
    order.modifiedDate = new Date(new Date().toUTCString());
    return await this.ordersRepository.update(order.id, order);
  }
}
