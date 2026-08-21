# mini-order-payments

NestJS starter for a mini order + M-Pesa (Daraja) payments workshop. Scaffolding, health check, and TODOs only — order/payment business logic is left for later days.

## Stack

- NestJS (TypeScript)
- TypeORM + PostgreSQL
- Docker Compose
- npm

## Setup

1. Copy env defaults:

   ```bash
   cp .env.example .env
   ```

2. Start Postgres + API:

   ```bash
   docker compose up --build
   ```

   Or run Postgres via Compose and the API locally:

   ```bash
   docker compose up postgres -d
   npm install
   npm run start:dev
   ```

## Verify the health check

With the API running on port 3000:

```bash
curl http://localhost:3000/health
```

Expected when the DB is reachable:

```json
{ "status": "ok", "db": "connected" }
```

If the DB ping fails, you get a `503` with a clear error payload.

## Project structure overview

```
src/
  app.module.ts          # root module — ConfigModule + TypeORM
  main.ts
  health/                # GET /health (works end-to-end)
  orders/                # Day 2 scaffold (entity/endpoints unimplemented)
  payments/              # Day 3 scaffold — mock DarajaService.initiateSTKPush
docker-compose.yml
Dockerfile
.env.example
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile |
| `npm run start:prod` | Run `dist/main` |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint |

## Module Overview

### Orders
## Controller(order.controller.ts)
It contains paths reative to operations on orders:
   GET     /orders -get all orders
   POST    /orders- Create an order
   GET     /orders/id- Get order by id
   POST    /order/edit/id - Edit order amount by id
   DELETE  /orders/id -Delete order by id

## Services(order.services.ts)
Contains operation functions on orders
   createNewOrder() - used to create a new order
   getOrderbyId()   - gets full order details by id
   getAllOrders()   - uses find() to return all orders in the db
   updateOrder()    - used by different endpoints to update order status throughout order lifecycle
   editOrder()      - called to edit order amount 
   deleteOrder()    - called when deleting orders

## Entity(order.entity.ts)
Contains definition of table orders and its attributes

## Module(order.module.ts)
It takes all components and ties them into one module that other external modules can use services inside it by simply importing the moduleand relevant component.
It registers controllers,services and entities so nextjs internal machine can know they exist.

## DTO(orders.dto.ts)
This data transfer object contains data rules that respective sevices should follow when passing data around

### Payments
## Controller(payment.controller.ts)
It contains paths reative to operations on orders:
   POST    /pay/id- Paying for an order by Id
   POST    /pay/mpesa/callback -This public route is used by safaricom to return reponses of a transaction

## Services
# 1.daraja.services.ts
Contains operation functions on payments
   initiateSTKpush() - This takes in phone number,amount and order Id which it encompases into a payload and sends the stk push through safaricom servers
   payfororder()   - This function collectively calls the initiateSTKPush and adds payment data to the database and
   createNewPayment()   - This helps in creating a new row of entries in table payments it is called in payForOrder()
   handleDarajaCallback()    -called by the endpoint  "POST   /pay/mpesa/callback" and verifies payment status .If result code is 0 the transaction was a success and it updates the payments and orders table  accordingly.

# 2.darajaAuth.services.ts
contains authentication operations and access token generation for use of the daraja API mpesa payment bridge
it is called in daraja.service.ts on the stkPush start


## Entity(payment.entity.ts)
Contains definition of table payments and its attributes

## Module(payment.module.ts)
It takes all components and ties them into one module that other external modules can use services inside it by simply importing the module and relevant component.

It registers  controllers so they can be available in nextjs' internal wiring

it import orderModule to be able to use orderRepository to edit orders and use orderService operations such as find order by ID

## DTO(orders.dto.ts)
This data transfer object contains data rules that respective sevices should follow when passing data around


### Health
## Controller(health.controller.ts)
Has endpoint Get /Health that checks if the database is up and running by sending a simple query "SELECT 1"

## Unit Test(health.controller.spec.ts)
This tests if the controller can handle both sceenarios of db being up and down

## Module(Health.module.ts)
It registers the  controller ,health.controller.ts , so nextjs knows /health endpoint exists and so it can be accessible to any other module that imports the health module
