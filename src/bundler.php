<?php
    /* IMPORT */
    require 'tools/minimize.php';
    $bundles = file_get_contents("bundler.json");
    $bundles = json_decode($bundles, true);
    /* INIT */
    /* SETUP */
    $prefix = "";

/* --- CODE --------------------------------------------------------------------------------------------------------------------------------- */

    /* FUNCTIONS */
    function collectAll($arr,$func){ $c="";
        foreach ($arr as &$value) {
            $c .= call_user_func($func, $value);
        } return $c;
    }
    

    /* MAIN */
    $path = str_replace($prefix,"",$_SERVER["REQUEST_URI"]);
    $bundle = $bundles[$path];
    if($bundle != NULL){
        $ext = pathinfo($path)['extension'];
        header("HTTP/1.1 200 OK", true);
        header('X-Powered-By:PHP/'.phpversion()); 
        if($ext == "css"){
            header("Content-Type: text/css");
            echo collectAll($bundle,'getCss');
        }
        elseif($ext == "js"){
            header("Content-Type: application/javascript");
            echo collectAll($bundle,'getJs');
        }
        else{
            header("Content-Type: text/html");
            echo collectAll($bundle,'getHTML');
        }
    }else{
        header( 'HTTP/1.1 404 NOT FOUND' );
        header("Location: ".$prefix."/");
    } 
?>