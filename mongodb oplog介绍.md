#### 背景


oplog的主要作用是同步主节点的数据到数据库第二节点(secondary node),和普通的日志不一样，是一个固定集合([apped](https://docs.mongodb.com/manual/reference/glossary/#term-capped-collection))，存储在数据库local的oplog.rs集合下面，可以使用下面命令查看
```
use local
db.oplog.rs.find({}).pretty()

```

如果你插入一条数据，还可以查看到对应的数据,如下图所示
```
{
	"ts" : Timestamp(1583073809, 4),
	"t" : NumberLong(2),
	"h" : NumberLong("-3748017590123959442"),
	"v" : 2,
	"op" : "i",
	"ns" : "test.school",
	"ui" : UUID("35cfeb88-a256-4987-b1ec-29272adae7f5"),
	"wall" : ISODate("2020-03-01T14:43:29.745Z"),
	"lsid" : {
		"id" : UUID("58647910-4bea-400b-91db-3bc416d4955c"),
		"uid" : BinData(0,"47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=")
	},
	"txnNumber" : NumberLong(2),
	"stmtId" : 0,
	"prevOpTime" : {
		"ts" : Timestamp(0, 0),
		"t" : NumberLong(-1)
	},
	"o" : {
		"_id" : ObjectId("5e5bca117a82f2f3244d6bd6"),
		"name" : "Qinghua University",
		"location" : "Beijing"
	}
}

```



##### mongodb如何管理和维护oplog
* oplog的大小限制
  
|  系统   | 默认  | 最小 | 最大|
|  ----  | ----  | ----  | ----  |
| linux  | 5% disk | 990 MB |	50 GB |
| window  | 5% disk | 990 MB | 50 GB |
| mac os  | 192M | 990 MB| 50 GB |

这上面有一个矛盾点，就是mac os默认是192M，但是最小为什么是990M，因为oplog可以修改大小，我的本机是mac os，运行修改命令被提示最小需要990M，但是查看默认是192M

```
use local
db.oplog.rs.stats().maxSize/1024/1024
>> 192
db.runCommand({replSetResizeOplog:true,size:100})
{
	"operationTime" : Timestamp(1584106190, 1),
	"ok" : 0,
	"errmsg" : "oplog size should be 990MB at least",
	"code" : 72,
	"codeName" : "InvalidOptions",
	"$clusterTime" : {
		"clusterTime" : Timestamp(1584106190, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```
oplog在replica set情况下不能被删除，大家可以使用一下命令试试
  
```
use local
db.oplog.rs.drop()
```


##### 如何设置合适的oplog
设置oplog的大小需要理解一个核心的原则，oplog所有的操作都是幂等性的，所以mongodb必须把所有变化的操作都拆成单个变化去保存，也就是所有的增删改都会记录在oplog上面

* 当查询比较多，增删改比较少的时候oplog不需要做什么改变
* 当插入和删除对等，数据库数据量不变，但是oplog快速增长，需要考虑多设置oplog size
* 批量修改，插入，更新比较多的时候需要考虑多设置oplog size，因为一个语句有可能会设置上100条oplog
  ```
  db.student.insert([{age:1},{age:2}....])
  ```

##### 副本集本地一键快速部署
[部署参考](https://github.com/TimLiu1/shell-deploy-mongodb-replica-and-Sharded)