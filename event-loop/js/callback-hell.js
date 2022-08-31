
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


function main() {
    // 张三的日常
    seeWeatherReport(function (isRain) {
        if (isRain) {
            console.log('带上伞去地铁站等地铁')
            waitingSubway(() => {
                waitingSubwayToDestination(() => {
                    console.log('下地铁到公司')
                })
            })
        }
    })

    function seeWeatherReport(callback) {
        setTimeout(() => {
            console.log('张三看了天气预报，今天下雨')
            callback(true)
        }, 1000)
    }

    function waitingSubway(callback) {
        setTimeout(() => {
            console.log('地铁来了')
            callback()
        }, 1000)
    }

    function waitingSubwayToDestination() {
        setTimeout(() => {
            console.log('地铁到达目的地')
            callback()
        }, 1000)
    }
}


function main2() {
    // 张三的日常
    seeWeatherReport()
        .then(isRain => {
            if (isRain) {
                console.log('带上伞')
                return waitingSubway()
            }
            console.log('不用带')
            return waitingSubway()
        })
        .then(() => {
            console.log('到地铁站了')
            return waitingSubwayToDestination()
        })
        .then(() => {
            console.log('到站了区公司')
        })

    function seeWeatherReport() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('张三看了天气预报，今天下雨')
                resolve(true)
            }, 1000)
        })
    }

    function waitingSubway(callback) {
        setTimeout(() => {
            console.log('地铁来了')
            callback()
        }, 1000)
    }

    function waitingSubwayToDestination() {
        setTimeout(() => {
            console.log('地铁到达目的地')
            callback()
        }, 1000)
    }
}
