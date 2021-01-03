const $siteList = $('.siteList')
const $dlg = $('.dlg-container')
const $deleteBtn = $(".delete-btn");
const $finishBtn = $(".finish-btn");
const $cancelBtn = $(".cancel-btn");
//取出缓存x
//将JSON数据重新转换为对象
const xObject = JSON.parse(localStorage.getItem('x'));
//如果xObject不为falsy值，使用xObject,如果是falsy值，使用初始值
const hashMap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn', des: 'Acfun'},
    {logo: 'B',  url: 'https://bilibili.com', des: 'Bilibili'}
];
const removeHeader = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')
}

const dlg = {
    show: (site={des:'',url:''})=>{
        const {des,url} = site;
        $("#des").val(des);
        $("#url").val(url);
        $dlg.removeClass("hide-dlg");
    },
    hide: (reload=false)=>{
        if(reload){
            render();
        }
        $dlg.addClass("hide-dlg");
    },
    selIndex: null,
};



loadEvent();
render();


function render(){
    // $siteList.find('li:not(.lastLi)').remove();
    const lis = [];
    hashMap.forEach((node,index) => {
        const $li = (`
    <a href="${node.url}">
      <li class="site">
        <div class="logo">${node.logo}</div>
        <div class="link">${node.des}</div>
        <button data-index="${index}" class="list-more" title="修改"></button>
      </li>
    </a>
    `);
        lis.push($li);
    });
    lis.push(`<li class="lastLi">
          <div class="addButton">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconadd"></use>
            </svg>
          </div>
        </li>`);
    $siteList.html(lis.join(""));
    $(".list-more").click((e)=>{
        const {index} = e.target.dataset;
        dlg.selIndex = index;
        dlg.show(hashMap[index]);
        e.stopPropagation();
        e.preventDefault();
    });
    $('.addButton').on('click', () => {
        dlg.selIndex = null;
        dlg.show();
    })
}



function loadEvent(){
    $cancelBtn.click((e)=>{
        dlg.hide();
    });
    $finishBtn.click((e)=>{
        const des = $("#des").val();
        const url = $("#url").val();
        if(des && url) {
            const site = getSite(des,url);
            if(dlg.selIndex<url){
                hashMap[dlg.selIndex] = site;
            }else{
                hashMap.push(site);
            }
            dlg.hide(true);
        }
    });
    $deleteBtn.click(()=>{
        if(dlg.selIndex){
            hashMap.splice(dlg.selIndex,1);
        }
        dlg.hide(true);
    });
    window.onbeforeunload = ()=>{
        localStorage.setItem("siteStorage",JSON.stringify(siteList));
    };
}

function getSite(des,url){
    const logo = removeHeader(url)[0].toUpperCase();
    return {
    logo: logo,  url: url, des: des
    };
}

window.onbeforeunload = () => {
    //将hashmap转换成JSON格式(即字符串类型)，存入本地缓存
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);
}

$(document).on('keypress',(e)=>{
    const {key} = e;
    for(let i=0;i<hashMap.length;i++){
        if(hashMap[i].logo.toUpperCase() === key.toUpperCase()){
            window.open(hashMap[i].url)
        }
    }
});