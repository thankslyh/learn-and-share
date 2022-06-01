
//result_callback：下载结果的回调函数
//url：需要获取URL的内容
function GetUrlContent(result_callback,url) {
    let request = new XMLHttpRequest()

    request.open('GET', url)

    request.responseType = 'text'

    request.onload = function () {

        result_callback(request.response)

    }

    request.send()

}

function IDCallback(id) {

    console.log(id)

    let new_name_url = name_url + "?id="+id

    GetUrlContent(NameCallback,new_name_url)

}

function NameCallback(name) {

    console.log(name)

}

GetUrlContent(IDCallback,id_url)
