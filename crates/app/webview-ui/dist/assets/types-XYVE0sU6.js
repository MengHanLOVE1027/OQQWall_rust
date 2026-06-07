import{U as z,Y as f,W as p,b7 as C,a8 as h,d as k,E as l,ac as x,a7 as _,$ as T,a0 as g,a1 as w,ar as $,B as m,l as B,P as N,a2 as j,aS as L}from"./index-DJD1gAZo.js";function W(e,i="default",t=[]){const o=e.$slots[i];return o===void 0?t:o()}function O(e){const{opacityDisabled:i,heightTiny:t,heightSmall:s,heightMedium:o,heightLarge:a,heightHuge:c,primaryColor:r,fontSize:n}=e;return{fontSize:n,textColor:r,sizeTiny:t,sizeSmall:s,sizeMedium:o,sizeLarge:a,sizeHuge:c,color:r,opacitySpinning:i}}const R={common:z,self:O},E=f([f("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),p("spin-container",`
 position: relative;
 `,[p("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[C()])]),p("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),p("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[h("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),p("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),p("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[h("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),A={small:20,medium:18,large:16},I=Object.assign(Object.assign({},g.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),V=k({name:"Spin",props:I,slots:Object,setup(e){const{mergedClsPrefixRef:i,inlineThemeDisabled:t}=T(e),s=g("Spin","-spin",E,R,e,i),o=m(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:d},self:u}=s.value,{opacitySpinning:v,color:y,textColor:b}=u,S=typeof n=="number"?N(n):u[j("size",n)];return{"--n-bezier":d,"--n-opacity-spinning":v,"--n-size":S,"--n-color":y,"--n-text-color":b}}),a=t?w("spin",m(()=>{const{size:n}=e;return typeof n=="number"?String(n):n[0]}),o,e):void 0,c=L(e,["spinning","show"]),r=B(!1);return $(n=>{let d;if(c.value){const{delay:u}=e;if(u){d=window.setTimeout(()=>{r.value=!0},u),n(()=>{clearTimeout(d)});return}}r.value=c.value}),{mergedClsPrefix:i,active:r,mergedStrokeWidth:m(()=>{const{strokeWidth:n}=e;if(n!==void 0)return n;const{size:d}=e;return A[typeof d=="number"?"medium":d]}),cssVars:t?void 0:o,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){var e,i;const{$slots:t,mergedClsPrefix:s,description:o}=this,a=t.icon&&this.rotate,c=(o||t.description)&&l("div",{class:`${s}-spin-description`},o||((e=t.description)===null||e===void 0?void 0:e.call(t))),r=t.icon?l("div",{class:[`${s}-spin-body`,this.themeClass]},l("div",{class:[`${s}-spin`,a&&`${s}-spin--rotate`],style:t.default?"":this.cssVars},t.icon()),c):l("div",{class:[`${s}-spin-body`,this.themeClass]},l(x,{clsPrefix:s,style:t.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${s}-spin`}),c);return(i=this.onRender)===null||i===void 0||i.call(this),t.default?l("div",{class:[`${s}-spin-container`,this.themeClass],style:this.cssVars},l("div",{class:[`${s}-spin-content`,this.active&&`${s}-spin-content--spinning`,this.contentClass],style:this.contentStyle},t),l(_,{name:"fade-in-transition"},{default:()=>this.active?r:null})):r}}),H={drafted:"已接收",render_requested:"待渲染",rendered:"已渲染",review_pending:"待审核",reviewed:"已审核",scheduled:"已排队",sending:"发送中",sent:"已发送",rejected:"已拒绝",skipped:"已跳过",manual:"人工处理",failed:"失败"},q={approve:"通过",reject:"拒绝",delete:"删除",defer:"暂缓",skip:"跳过",immediate:"立即发送",refresh:"刷新",rerender:"重渲染",select_all:"全选",toggle_anonymous:"切换匿名",expand_audit:"展开审核",show:"展示",comment:"评论",reply:"回复",blacklist:"拉黑",quick_reply:"快捷回复",merge:"合并"},D=["approve","reject","delete","defer","skip","immediate","refresh","rerender","select_all","toggle_anonymous","expand_audit","show","comment","reply","blacklist","quick_reply","merge"];export{q as A,V as N,H as S,D as a,W as g};
