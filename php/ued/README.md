#### http://ued.dukuai.com/work/workshow.php

* 一些php的知识点。
	* 数组操作
	* mysql连表查询，group查询等……
	* 时间处理函数
	
	
```
$memberUser=$db->fetch_first("SELECT m.*, mf.*,mo.fid,u.grouptitle, u.type, u.creditshigher, u.creditslower, u.readaccess,u.color AS groupcolor, u.stars AS groupstars, u.allownickname, u.allowuseblog, r.ranktitle,r.color AS rankcolor FROM {$tablepre}members m LEFT JOIN {$tablepre}memberfields mf ON mf.uid=m.uid LEFT JOIN {$tablepre}usergroups u ON u.groupid=m.groupid LEFT JOIN {$tablepre}ranks r ON m.posts>=r.postshigher LEFT JOIN {$tablepre}moderators mo ON mo.uid=m.uid WHERE m.uid='$uid' ORDER BY r.postshigher DESC LIMIT 1");
```
	

```
	/**
 * 获取三个月前的日期
 * @param $m
 * @return bool|string
 */
function getThreeMonth($m){
    $last_m=date('Y-m-d', strtotime('-3 months'));
    if($m){
        $last_m = date( "Y-m-d", mktime(0,0,0,date("m",strtotime($m))-3,date("d",strtotime($m)),date("Y",strtotime($m))) );
    }
    $dateline=strtotime($last_m);
    return $dateline;
}
	
```