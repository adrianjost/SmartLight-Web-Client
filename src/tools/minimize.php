<?php

/* --- CSS --------------------------------------------------------------------------------------------------------------------------------- */

    require 'lessc.inc.php';
    function minCss($rawcss){	// minimize given css code
        // remove unnecessary characters
        $buffer = str_replace(array("\r\n", "\r", "\n", "\t"), '', $rawcss);
        $buffer = preg_replace('/ {2,}/', ' ', 	$buffer);		// Collapse adjacent spaces into a single space
        $buffer = str_replace(	' @', 	'@', 	$buffer);
        $buffer = str_replace(	': ', 	':', 	$buffer);
        $buffer = str_replace(	'{ ', 	'{', 	$buffer);
        $buffer = str_replace(	' {', 	'{', 	$buffer);
        $buffer = str_replace(	'} ', 	'}', 	$buffer);
        $buffer = str_replace(	' }', 	'}', 	$buffer);
        $buffer = str_replace(	'; ', 	';', 	$buffer);
        $buffer = str_replace(	' ;', 	';', 	$buffer);
        $buffer = str_replace(	', ', 	', ', 	$buffer);			
        $buffer = str_replace(	' ,', 	' ,', 	$buffer);
        $buffer = str_replace(	';}',  	'}', 	$buffer);
        // return minimized css
        return $buffer;
    }
    function getCss($path){
        $less = new lessc();
        return minCss($less->compileFile($path));
    } 
/* --- HTML --------------------------------------------------------------------------------------------------------------------------------- */

    function minHTML($buffer){
        $buffer = str_replace(array("\r\n", "\r", "\n", "\t"), '', $buffer);
        $buffer = preg_replace("<<!--(?!<!)[^\[>].*?-->>", "", $buffer); // remove HTML-Comments
        $buffer = preg_replace('~>\s+<~', '><', $buffer);
        $buffer = preg_replace('/ {2,}/', ' ', 	$buffer);
        return $buffer;
    }
    function getHTML($path){
        ob_start(); // turn on output buffering
        include($path);
        $res = ob_get_contents(); // get the contents of the output buffer
        ob_end_clean(); 
        return minHTML($res);
    }

/* --- JS --------------------------------------------------------------------------------------------------------------------------------- */
    function minJS($buffer){
        $buffer = preg_replace('/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/', '', 	$buffer);
        //$buffer = str_replace(array("\r\n", "\r", "\n", "\t"), '', $buffer);
        $buffer = preg_replace('/ {2,}/', ' ', 	$buffer);
        return $buffer."\n";
    }
    function getJS($path){ 
        return minJS(file_get_contents($path));
    }
?>