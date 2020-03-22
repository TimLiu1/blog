#### 简介
journal 不同于普通的日志，主要的目的是当mongodb发生不期望的宕机时维护数据安全性使用



##### journal 和 WireTiger
WireTiger存储引擎为了保持数据的一致性，每60秒会做一次checkpoints,让内存中的所有数据持久化，但是如果在两个checkpoints之间mongodb发生意外宕机，那么这60秒的数据将会丢失，为了维护这60秒的数据的安全性，mongodb会把所有的写操作提前记录在journal，如果发生宕机，会使用journal恢复数据，以下是恢复步骤

* 找到最后一个checkpoint的标识符
* 在journal里面找到与之对应的标识符
* 把标识符之后的操作执行一遍，包括更新和索引 


##### 何时触发journal写到disk

* 每100ms持久化到disk
* 设置replica set的角色的时候触发
* journal达到128k的时候触发（不同的线程都会先把写存在buffer里面，到达128k的时候写到disk）

##### journal存储和限制

* journal数据是存储在数据库的子目录journal下面，采用的是预分配原则。
* 每个journal日志文件大约记录100M的日志，然后就会产生新的日志文件
* journal会把老旧的，和checkpoints没有关系的journal文件删除

