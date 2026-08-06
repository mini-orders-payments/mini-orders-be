Orders Module

Controller(order.controller.ts)
It contains paths reative to operations on orders:
   GET     /orders -get all orders
   POST    /orders- Create an order
   GET     /orders/id- Get order by id
   POST    /order/edit/id - Edit order amount by id
   DELETE  /orders/id -Delete order by id

Services(order.services.ts)
Contains operation functions on orders
   createNewOrder() - used to create a new order
   getOrderbyId()   - gets full order details by id
   getAllOrders()   - uses find() to return all orders in the db
   updateOrder()    - used by different endpoints to update order status throughout order lifecycle
   editOrder()      - called to edit order amount 
   deleteOrder()    - called when deleting orders

Entity(order.entity.ts)
Contains definition of table orders and its attributes

Module(order.module.ts)
It takes all components and ties them into one module that other external modules can use services inside it by simply importing the module
and relevant component.

DTO(orders.dto.ts)
This data transfer object contains data rules that respective sevices should follow when passing data around