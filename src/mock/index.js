import Mock from 'mockjs';
const data = Mock.mock({
  'root': {
    url: "@image('50*50','#FF83FA','#FCFCFC','jpg','帅坤')",
    time: "@date(yyyy-MM-dd)"
  }
})
Mock.mock("/api/img","post",(options)=>{
  return {
    status: 200,
    message: "请求成功",
    list: data
  };
})
