import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from 'src/orders/order.service';
import { Order } from 'src/orders/order.entity';
import { CreateOrderDto } from 'src/orders/orders.dto';
import jest

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<Repository<Order>>;

  // 1. Create fake database functions
  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    // 2. Build a fake NestJS testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order), // Inject fake repo instead of real DB
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(getRepositoryToken(Order));
    
    // Clear mock histories between tests so tests don't pollute each other
    jest.clearAllMocks();
  });