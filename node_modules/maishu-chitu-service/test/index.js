const { Service } = require('../dist/index');
let service = new Service();
service.ajax("http://service.z.bailunmei.com:8084/app/car_serial/getList")
    .then((r) => {
        console.log('success')
        console.log(r)
    })
    .catch((err)=>{
        console.log(err)
        console.log('fail')
    })