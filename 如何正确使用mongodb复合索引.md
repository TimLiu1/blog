#### 背景
复合索引如果使用不当，会带来以下问题
* 索引失效
* 重复建立索引
* 排序失效


##### 索引失效

复合索引生效的原则是前缀生效，举个例子，有一个student的集合，有三个字段age、class、name, 如果创建如下索引
> db.student.createIndex({age:1,class:1,name:1})

以下的场景索引是生效的,因为它们都包含了索引的前缀
```
db.student.find({age:18,class:1,name:'张飞'})
db.student.find({age:18,class:1})
db.student.find({age:18})
db.student.find({class:1,age:1})
db.student.find({age:1,name:'张飞'})
```

以下场景都是无效，因为它们没有包含索引前缀
```
db.student.find({class:1})
db.student.find({class:1,name:'张飞'})

```


##### 重复建立索引

有一个student的集合，有两个字段age、class 如果创建如下索引
> db.student.createIndex({age:1})
> db.student.createIndex({age:1,class:1})


以下的场景使用的索引都是 db.student.createIndex({age:1,class:1}),第一个索引永远不会发挥作用，反而浪费了存储和降低了插入性能

```
db.student.find({age:18})
db.student.find({age:18,class:1})

```

##### 排序失效
索引是按照排序存储的，排序的原则是先排第一个键，然后在排第二个键，然后按照规则的升降序排，如果查询语句不符合规则，那排序就会变成内存排序，索引排序失效

有一个student的集合，有三个字段age、class
> db.student.createIndex({age:1,class:-1})

以下查询使用索引排序,因为复合或则完全倒置索引规则
```
db.student.find({age:18,class:1}).sort({age:1,class:-1})
db.student.find({age:18,class:1}).sort({age:-1,class:1})

```

以下查询索引排序无效,因为和索引排序相冲突

```
db.student.find({age:18,class:1}).sort({age:1,class:1})
db.student.find({age:18,class:1}).sort({age:-1,class:-1})
```

