import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from 'src/orders/order.service';
import { Order } from 'src/orders/order.entity';
import { CreateOrderDto } from 'src/orders/orders.dto';


describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<Repository<Order>>;

  
  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    
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
    
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewOrder', () => {
    it('should successfully create and save a new order', async () => {
      // 1. Arrange
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        orderNumber: 1001,
        amount: 2500,
        status: 'PENDING',
      };

      const createdEntity = { ...createOrderDto } as Order;
      const savedOrder: Order = {
        id: 1,
        ...createOrderDto,
        createdAt: new Date(),
      };

      // Mock implementation behavior
      mockOrderRepository.create.mockReturnValue(createdEntity);
      mockOrderRepository.save.mockResolvedValue(savedOrder);

      // 2. Act
      const result = await service.createNewOrder(createOrderDto);

      // 3. Assert
      expect(repository.create).toHaveBeenCalledWith(createOrderDto);
      expect(repository.create).toHaveBeenCalledTimes(1);
      
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(repository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(savedOrder);
    });