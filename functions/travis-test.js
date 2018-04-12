var count = 1;

function http(id, url, type, body) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.addEventListener("load", function(){
    const response = this;
    const string = body.textString;
    const error = (response.status !== 200)?response.responseText:"";
    showStatus(id, response.status === 200, string, error );
  });
  xmlHttp.open( type, url, true ); // false for synchronous request
  if(type==="POST"){
    xmlHttp.setRequestHeader("Content-Type", "application/json");
  }
  if(body){
    xmlHttp.send( JSON.stringify(body) );
  }else {
    xmlHttp.send(null);
  }
  return xmlHttp;
}

function testRequest(string){
  const url = "http://localhost:5001/smartlight-4861d/us-central1/api/set-lamp-color";
  const request = {
    "uid": "IcAd2hRhBoRs5WTORWTTCSaRSvy2",
    "secret": "R6wWdzNd6pjnk8tbkGOdC5ExGqUPZa8l0MVlt4kxiTIlKc3sFxk7q3C1Jk7bnNCWQO3bsQivv9p7ABfoZ7YdOjKmwQWMbS5hHiTYzvlKiO4EBEdhH2fcRPLx4uj78UAJgZAOYNPLmqKtsJP3Fg8Lrb3yWqVFi7Tu5ap54WhiSQoHEDKWZqKvHOunZHc8UEBj4KTEWbFIJRHgNvxhPxythW1UnL16ukdeAqokTXq0rFWFdRtTDFYN8nTHXhEGljia7dJLsO4FqFUkb842NaCuCDi4PFV9i0exkXUEn0nW8RtqiwbBkZW0iiD6ffdIKsFwNJRlEWja6Re1YhAhI3R9bPefz7lDswJAm2XvJMDHh1BNW3ugadEtReTrQUGEPdJ8xKnHtuYknpAs4jzpSI6uzcinM3g4ldgitQKzARlJS1PockSJd84fLaNyKkt82weri4e6t4pgASXliit8u8yiWQ744MdX4qOJfwD897Doy8hkPN0wSAgLXRlOLYdpweGv3DR5qYEi8xBRKM5ftmR8FGanIdE67CjIWvEJ9gcFlwx2nMf8bs8vTZugNiCPMfegU9A3SHSPa2lzNXUCFFicIfbV1HwkjpH2irI1jpccVh2VKc1F4DyfKkm1cgkkWjLW3NRZrgGh4nNcoH1TIYWrrzlHifs0zQUjmWku6OxeMtegCki1BygB7n2TlGun1RZ2mLhSNY8luwvY8gJvOFptgmCRmQUo5C9dqa99iF2M5FrnFKxt9M6ulcYyvQBocyp8s7MlMBHACuVgu30IyOY7yi9zlTDKKmYmDLhwwjTMu1E1L6XD6iPH5PQTZw8CMh2vkaOSxGAvUxw7914Dpefw8QFXfMc8Zm18v2U4P7o0HU5bAMsSAoKFcKc8uu3LFqxRcMkvz2UzuxZl8xllkxWECyDvmHVWRlkz0BwMR4Aen4m1K12Ma0U3d34VYun4SZ1fRu3XW3ax9VUiQ2ROJV82IcBbAxfGvs4dasf2YbdUjDSzbYzm3KKruIWWA3rLtRZV",
    "textString": string
  };
  http(count ++,url, "POST", request);
}

function showStatus(id, status, body, error){
  const content = `${status?'✔':'✘'} - ${JSON.stringify(body)} - ${error}`;
  let para = document.createElement("p");
  if(status){
    para.setAttribute("style", "color: teal;");
  }else{
    para.setAttribute("style", "background-color: lightpink; color: white;");
    console.error(content);
  }
  let node = document.createTextNode(content);
  let paraNum = document.createElement("span");
  let nodeNum = document.createTextNode(id);
  paraNum.appendChild(nodeNum);
  para.appendChild(paraNum);
  para.appendChild(node);

  let element = document.getElementById("log");
  element.appendChild(para);
}

function test() {
  console.log("run test...");
  //"Hey Google, Licht ... machen"
  //"Hey Google, mache das Licht ..."
  testRequest("von Bett grün");
  testRequest("vom Bett rot");
  testRequest("im Bett orange");
  testRequest("vom Bett lila");
  testRequest("von unserm Bett blau");
  testRequest("vom unserem Bett türkis");
  testRequest("vom unserem Bett lila bitte");
  testRequest("von unserem Bett pink bitte");
  testRequest("vom Bett bitte gelb");
  testRequest("AN in unserem Bett");
  testRequest("AUS im Bett");
}

document.addEventListener("DOMContentLoaded", test, false);
