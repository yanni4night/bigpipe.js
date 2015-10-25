<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Demo</title>
        <style type="text/css">
            #header {height: 300px;width:100px;float:left;}
            #content {height: 300px;width:100px;float:left;}
            #aside {height: 100px;width:100px;float:left;}
            #footer {height: 100px;width:100px;float:left;}
            .content > div {margin: 10px 0;}
        </style>
        <script src="./bigpipe.min.js"></script>
    </head>
    <body>
<div class="content">
    <div id="header"></div>
    <div id="content"></div>
    <div id="aside"></div>
    <div id="footer"></div>
</div>
<?php

$pagelets = array();

array_push($pagelets, array(
    'id' => 'header',
    'css' => array('./test/header.css'),
    'js' => array(),
    'content' => '<h1>This is header pagelet</h1>'
));

array_push($pagelets, array(
    'id' => 'content',
    'css' => array('./test/content.css'),
    'js' => array(),
    'content' => '<article>This is content pagelet</article>'
));

array_push($pagelets, array(
    'id' => 'aside',
    'css' => array('./test/aside.css'),
    'js' => array(),
    'content' => '<div class="ad">This is aside pagelet</div>'
));

array_push($pagelets, array(
    'id' => 'footer',
    'css' => array('./test/footer.css'),
    'js' => array(),
    'content' => '<footer class="copyright">This is footer pagelet</footer>'
));

shuffle($pagelets);

foreach ($pagelets as $key => $pagelet) {
    sleep(1);
?>
<script>
    TBP({
        id: '<?=$pagelet['id']?>',
        css: <?=json_encode($pagelet['css'])?>,
        js: <?=json_encode($pagelet['js'])?>,
        content: '<?=$pagelet['content']?>'
    });
</script>
<?php
ob_flush();
flush();
}
?>
    </body>
    <script type="text/javascript"></script>
</html>