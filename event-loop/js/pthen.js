fetch(id_url)
    .then((response) => {
        return response.text()
    })
    .then((response) => {
        let new_name_url = name_url + "?id=" + response
        return fetch(new_name_url)
    }).then((response) => {
    return response.text()
}).then((response) => {
    console.log(response)//输出最终的结果
})
