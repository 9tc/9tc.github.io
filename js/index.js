function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    return response.json();
}

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}


function clearText(){
    let e = document.getElementById("inputSource");
    e.value = '';
}

async function submit() {
    if(document.getElementById("chapter").value === "t") return;

    document.getElementById("output").value = "";
    let e = document.getElementById("inputSource").value;
    let c = document.getElementById("chapter").value;
    let chap = "chapters/" + c + "/";
    let lang = document.getElementById("language").value;
    for (let i = 1; i <= 10; i++) {
        document.getElementById("output").value += "Case " + i + " : ";
        var input = "in" + i + ".txt";
        var output = "out" + i + ".txt";
        //var buildData = build()
        const createUrl = "http://api.paiza.io:80/runners/create";

        var inputFile, outputFile;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", chap + input, true);
        xmlHttp.send(null);
        xmlHttp.onload = function () {
            //console.log(xmlHttp.responseText);
            inputFile = xmlHttp.responseText;
            xmlHttp.open("GET", chap + output, true);
            xmlHttp.send(null);
            xmlHttp.onload = async function () {
                //console.log(xmlHttp.responseText);
                outputFile = xmlHttp.responseText;

                const data = {
                    source_code: e,
                    language: lang,
                    input: inputFile,
                    api_key: "guest",
                };

                const res = await postData(createUrl, data);
                const sessionId = res.id;
                //console.log("sessionID = " + sessionId);
                const detailUrl = `http://api.paiza.io/runners/get_details?id=${sessionId}&api_key=guest`;
                await sleep(4000);
                const response = await getData(detailUrl);

                /*
                console.log("BuildResult : " + response.build_result);

                console.log("RunResult : " + response.result + " : " + response.stdout);
                console.log(response.stdout + outputFile);

                console.log(Object.is(response.stdout.slice(0, -1) + "\n", outputFile));
                console.log(response.stdout.length +" "+ outputFile.length);
                */

                if(response.build_result !== "success"){
                    document.getElementById("output").value += "RE\n";
                }else if(response.build_time > 2){
                    document.getElementById("output").value += "TLE\n";
                } else if(response.stdout.slice(0, -1) === outputFile.slice(0, -2)){
                    document.getElementById("output").value += "AC (" + response.build_time + "s)\n";
                } else {
                    document.getElementById("output").value += "WA\n";
                }
            }
        }
        await sleep(5000);
    }

}

function read(input){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",input,true);
    xmlHttp.send(null);
    xmlHttp.onload = function(){
        console.log(xmlHttp.responseText);
        return xmlHttp.responseText;
    }
}
