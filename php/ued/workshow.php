<?php
define('CURSCRIPT', 'mydemand');
require_once './include/common.inc.php';
$navtitle = "作品墙";

if(!$discuz_uid){
	showmessage('group_nopermission', NULL, $siteurl);
}

$type=$_GET['type']|0;

if($type==0){
    $type=1;
}

$listNumber=$_GET['page']|0;

$maxNumber=30;

$ajax=$_GET['ajax'];

$uid=$_GET['uid'];

$sort=$_GET['sort'];


//三个月前的时间线
$dateline=getThreeMonth('');

$attachmentsList = '';
$i=1;

//查询附件表
if($uid){
    $sql_forum = $db->query("select a.*,m.username,t.subject ,z.uid as zuid from {$tablepre}attachments a,{$tablepre}members m,{$tablepre}threads t left join {$tablepre}zang z on t.tid=z.tid  where a.uid='$uid' and a.dateline > $dateline and a.uid=m.uid and a.tid=t.tid and m.groupid<4 Order By a.dateline desc;");

    $memberUser=$db->fetch_first("SELECT m.*, mf.*,mo.fid,u.grouptitle, u.type, u.creditshigher, u.creditslower, u.readaccess,u.color AS groupcolor, u.stars AS groupstars, u.allownickname, u.allowuseblog, r.ranktitle,r.color AS rankcolor FROM {$tablepre}members m LEFT JOIN {$tablepre}memberfields mf ON mf.uid=m.uid LEFT JOIN {$tablepre}usergroups u ON u.groupid=m.groupid LEFT JOIN {$tablepre}ranks r ON m.posts>=r.postshigher LEFT JOIN {$tablepre}moderators mo ON mo.uid=m.uid WHERE m.uid='$uid' ORDER BY r.postshigher DESC LIMIT 1");

    //查询指派的任务列表：版主id
    $fid=$memberUser['fid'];
    $threadOpenList=array();
    $openList=$db->query("select t.* from {$tablepre}threads t where t.closed<1 and t.bespokeid=$fid and t.dateline > $dateline ORDER BY t.dateline DESC");
    while($result = $db->fetch_array($openList)){
         $result['dateline'] = gmdate("$dateformat", $result['dateline'] + $timeoffset * 3600);
         array_push($threadOpenList,$result);
    };
    $threadOpenListLength=count($threadOpenList);

}else{
    $sql_forum = $db->query("select a.*,m.username,t.subject ,z.uid as zuid from {$tablepre}attachments a,{$tablepre}members m,{$tablepre}threads t left join {$tablepre}zang z on t.tid=z.tid  where a.dateline > $dateline and a.uid=m.uid and a.tid=t.tid and m.groupid<4 Order By a.dateline desc;");
}

//未标记cover的附件
$coversList=array();
//zang的个数
$zangMap=array();

//被赞过的tid
$zangedMap=array();

//每个uid的赞总数
$zangUid=array();

//group 查询
$zang_sql=$db->query("select tid ,count(*) as number from {$tablepre}zang group by tid;");
while($result = $db->fetch_array($zang_sql)){
    $zangMap[$result['tid']]=$result['number'];
};

while($result = $db->fetch_array($sql_forum)){
    $filename=$result['filename'];
    if(preg_match('/\.(swf|jpg|png|jpeg|gif|bmp)$/i',$filename)){
        $_attachmentsList='';
        if(preg_match('/\.swf$/i',$filename)){
            $_attachmentsList['isswf']=1;
        }

        $_attachmentsList['tid'] = $result['tid'];
        $_attachmentsList['aid'] = $result['aid'];
        $_attachmentsList['uid'] = $result['uid'];
        $_attachmentsList['filename'] = $result['filename'];
        $_attachmentsList['attachment'] = 'attachments/'.$result['attachment'];
        $_attachmentsList['username'] = $result['username'];
        $_attachmentsList['subject'] = $result['subject'];


        //每个uid赞的个数
        if($result['zuid']){
            $zangUid[$result['uid']]+=1;
            //判断tid是否被赞过
            if($result['zuid']==$discuz_uid){
                $zangedMap[$result['tid']]=true;
            }
        }

        if($result['cover']==1){
            $attachmentsList[$i]=$_attachmentsList;
            $i++;
        }else{
            $coversList[$result['tid']]=$_attachmentsList;
        }

    }
}


//合并两个数组
$count=count($attachmentsList);
for($i=0;$i<$count;$i++){
    if($attachmentsList[$i]){
        $coversList[$attachmentsList[$i]['tid']]=$attachmentsList[$i];
    }
}

//uid map
$userList=array();
//统计作品数
$userNumberMap=array();
foreach($coversList as $key=>$value){
    if(empty($userList[$value['uid']])){
        $userList[$value['uid']]=array();
    }
    if(count($userList[$value['uid']])<4){
        array_push($userList[$value['uid']],$value);
    }
    if(empty($userNumberMap[$value['uid']])){
        $userNumberMap[$value['uid']]=0;
    }
    $userNumberMap[$value['uid']]+=1;
}


//人气
if($sort==1){
    $coversList=sortList($coversList,$zangMap);
}

//直接这里分页了
$coversList=array_chunk($coversList,$maxNumber);
$coversList=$coversList[$listNumber];
$count=count($coversList);

function sortList($arr,$map){
    $n = count($arr);
    //按顺序，0开始
    $arr=array_chunk($arr,$n);
    $arr=$arr[0];
    for($i=1;$i<$n;$i++){
        for($j=$n-1;$j>=$i;$j--)
        {
//          if($arr[$j]<$arr[$j-1]){

            if($map[$arr[$j]['tid']]>$map[$arr[$j-1]['tid']]){
                $temp = $arr[$j-1];
                $arr[$j-1] = $arr[$j];
                $arr[$j] = $temp;
            }
        }
    }
    return $arr;
}




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

if($ajax){
    include template('workshow-ajax');
}else{
    //加载模块
    include template('workshow-hd');
    include template('workshow-'.$type);
}

?>
