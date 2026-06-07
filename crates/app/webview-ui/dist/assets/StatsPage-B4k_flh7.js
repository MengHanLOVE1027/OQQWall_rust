import{R as Re,n as _,o as ke,r as D,aU as ge,bA as Ne,bB as re,ab as ie,bC as Be,d as he,c as ze,f as P,h as u,i as Pe,a9 as F,g as Ie,a1 as ne,a0 as De,u as Z,$ as L,y as K,Z as Ge,a_ as Ee,b3 as oe,a7 as Me,p as je,x as se,az as Te,ad as ve,aF as me,aE as be,aD as ye,aG as xe,bD as Oe,s as M,e as q,a as x,b as I,j as U,z as Se,B as ae,m as H,t as X,an as We,P as Fe,D as k,E as f,H as m,bu as le,G as j,J as Ae,bt as T,F as O,L as B,ax as Y,bw as Q,bE as Ve,C as R,K as ce,bl as A,b7 as Le,_ as qe}from"./index-Coc4F4AS.js";import{g as He,S as Xe,N as Ye}from"./types-DolHYqWQ.js";import{a as Qe,u as Ue,N as Je}from"./use-message-DlUuChUH.js";function Ze(e){if(typeof e=="number")return{"":e.toString()};const t={};return e.split(/ +/).forEach(i=>{if(i==="")return;const[r,a]=i.split(":");a===void 0?t[""]=r:t[r]=a}),t}function W(e,t){var i;if(e==null)return;const r=Ze(e);if(t===void 0)return r[""];if(typeof t=="string")return(i=r[t])!==null&&i!==void 0?i:r[""];if(Array.isArray(t)){for(let a=t.length-1;a>=0;--a){const o=t[a];if(o in r)return r[o]}return r[""]}else{let a,o=-1;return Object.keys(r).forEach(n=>{const c=Number(n);!Number.isNaN(c)&&t>=c&&c>=o&&(o=c,a=r[n])}),a}}const Ke={xs:0,s:640,m:1024,l:1280,xl:1536,"2xl":1920};function et(e){return`(min-width: ${e}px)`}const V={};function tt(e=Ke){if(!Re)return _(()=>[]);if(typeof window.matchMedia!="function")return _(()=>[]);const t=D({}),i=Object.keys(e),r=(a,o)=>{a.matches?t.value[o]=!0:t.value[o]=!1};return i.forEach(a=>{const o=e[a];let n,c;V[o]===void 0?(n=window.matchMedia(et(o)),n.addEventListener?n.addEventListener("change",l=>{c.forEach(g=>{g(l,a)})}):n.addListener&&n.addListener(l=>{c.forEach(g=>{g(l,a)})}),c=new Set,V[o]={mql:n,cbs:c}):(n=V[o].mql,c=V[o].cbs),c.add(r),n.matches&&c.forEach(l=>{l(n,a)})}),ke(()=>{i.forEach(a=>{const{cbs:o}=V[e[a]];o.has(r)&&o.delete(r)})}),_(()=>{const{value:a}=t;return i.filter(o=>a[o])})}function rt(e){var t;const i=(t=e.dirs)===null||t===void 0?void 0:t.find(({dir:r})=>r===ge);return!!(i&&i.value===!1)}var it=/\s/;function nt(e){for(var t=e.length;t--&&it.test(e.charAt(t)););return t}var ot=/^\s+/;function st(e){return e&&e.slice(0,nt(e)+1).replace(ot,"")}var ue=NaN,at=/^[-+]0x[0-9a-f]+$/i,lt=/^0b[01]+$/i,ct=/^0o[0-7]+$/i,ut=parseInt;function _e(e){if(typeof e=="number")return e;if(Ne(e))return ue;if(re(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=re(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=st(e);var i=lt.test(e);return i||ct.test(e)?ut(e.slice(2),i?2:8):at.test(e)?ue:+e}var de=1/0,dt=17976931348623157e292;function ft(e){if(!e)return e===0?e:0;if(e=_e(e),e===de||e===-de){var t=e<0?-1:1;return t*dt}return e===e?e:0}function pt(e){var t=ft(e),i=t%1;return t===t?i?t-i:t:0}var gt=Be.isFinite,ht=Math.min;function vt(e){var t=Math[e];return function(i,r){if(i=_e(i),r=r==null?0:ht(pt(r),292),r&&gt(i)){var a=(ie(i)+"e").split("e"),o=t(a[0]+"e"+(+a[1]+r));return a=(ie(o)+"e").split("e"),+(a[0]+"e"+(+a[1]-r))}return t(i)}}var mt=vt("round");function bt(e){const{infoColor:t,successColor:i,warningColor:r,errorColor:a,textColor2:o,progressRailColor:n,fontSize:c,fontWeight:l}=e;return{fontSize:c,fontSizeCircle:"28px",fontWeightCircle:l,railColor:n,railHeight:"8px",iconSizeCircle:"36px",iconSizeLine:"18px",iconColor:t,iconColorInfo:t,iconColorSuccess:i,iconColorWarning:r,iconColorError:a,textColorCircle:o,textColorLineInner:"rgb(255, 255, 255)",textColorLineOuter:o,fillColor:t,fillColorInfo:t,fillColorSuccess:i,fillColorWarning:r,fillColorError:a,lineBgProcessing:"linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"}}const yt={common:he,self:bt};function xt(e){const{textColor2:t,textColor3:i,fontSize:r,fontWeight:a}=e;return{labelFontSize:r,labelFontWeight:a,valueFontWeight:a,valueFontSize:"24px",labelTextColor:i,valuePrefixTextColor:t,valueSuffixTextColor:t,valueTextColor:t}}const St={common:he,self:xt},fe=1,Ce=ze("n-grid"),$e=1,_t={span:{type:[Number,String],default:$e},offset:{type:[Number,String],default:0},suffix:Boolean,privateOffset:Number,privateSpan:Number,privateColStart:Number,privateShow:{type:Boolean,default:!0}},Ct=P({__GRID_ITEM__:!0,name:"GridItem",alias:["Gi"],props:_t,setup(){const{isSsrRef:e,xGapRef:t,itemStyleRef:i,overflowRef:r,layoutShiftDisabledRef:a}=Pe(Ce),o=Ie();return{overflow:r,itemStyle:i,layoutShiftDisabled:a,mergedXGap:_(()=>F(t.value||0)),deriveStyle:()=>{e.value;const{privateSpan:n=$e,privateShow:c=!0,privateColStart:l=void 0,privateOffset:g=0}=o.vnode.props,{value:b}=t,S=F(b||0);return{display:c?"":"none",gridColumn:`${l??`span ${n}`} / span ${n}`,marginLeft:g?`calc((100% - (${n} - 1) * ${S}) / ${n} * ${g} + ${S} * ${g})`:""}}}},render(){var e,t;if(this.layoutShiftDisabled){const{span:i,offset:r,mergedXGap:a}=this;return u("div",{style:{gridColumn:`span ${i} / span ${i}`,marginLeft:r?`calc((100% - (${i} - 1) * ${a}) / ${i} * ${r} + ${a} * ${r})`:""}},this.$slots)}return u("div",{style:[this.itemStyle,this.deriveStyle()]},(t=(e=this.$slots).default)===null||t===void 0?void 0:t.call(e,{overflow:this.overflow}))}}),$t={xs:0,s:640,m:1024,l:1280,xl:1536,xxl:1920},we=24,J="__ssr__",wt={layoutShiftDisabled:Boolean,responsive:{type:[String,Boolean],default:"self"},cols:{type:[Number,String],default:we},itemResponsive:Boolean,collapsed:Boolean,collapsedRows:{type:Number,default:1},itemStyle:[Object,String],xGap:{type:[Number,String],default:0},yGap:{type:[Number,String],default:0}},Rt=P({name:"Grid",inheritAttrs:!1,props:wt,setup(e){const{mergedClsPrefixRef:t,mergedBreakpointsRef:i}=Z(e),r=/^\d+$/,a=D(void 0),o=tt((i==null?void 0:i.value)||$t),n=L(()=>!!(e.itemResponsive||!r.test(e.cols.toString())||!r.test(e.xGap.toString())||!r.test(e.yGap.toString()))),c=_(()=>{if(n.value)return e.responsive==="self"?a.value:o.value}),l=L(()=>{var y;return(y=Number(W(e.cols.toString(),c.value)))!==null&&y!==void 0?y:we}),g=L(()=>W(e.xGap.toString(),c.value)),b=L(()=>W(e.yGap.toString(),c.value)),S=y=>{a.value=y.contentRect.width},s=y=>{Me(S,y)},v=D(!1),p=_(()=>{if(e.responsive==="self")return s}),d=D(!1),C=D();return K(()=>{const{value:y}=C;y&&y.hasAttribute(J)&&(y.removeAttribute(J),d.value=!0)}),je(Ce,{layoutShiftDisabledRef:se(e,"layoutShiftDisabled"),isSsrRef:d,itemStyleRef:se(e,"itemStyle"),xGapRef:g,overflowRef:v}),{isSsr:!Ge,contentEl:C,mergedClsPrefix:t,style:_(()=>e.layoutShiftDisabled?{width:"100%",display:"grid",gridTemplateColumns:`repeat(${e.cols}, minmax(0, 1fr))`,columnGap:F(e.xGap),rowGap:F(e.yGap)}:{width:"100%",display:"grid",gridTemplateColumns:`repeat(${l.value}, minmax(0, 1fr))`,columnGap:F(g.value),rowGap:F(b.value)}),isResponsive:n,responsiveQuery:c,responsiveCols:l,handleResize:p,overflow:v}},render(){if(this.layoutShiftDisabled)return u("div",ne({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style},this.$attrs),this.$slots);const e=()=>{var t,i,r,a,o,n,c;this.overflow=!1;const l=Ee(He(this)),g=[],{collapsed:b,collapsedRows:S,responsiveCols:s,responsiveQuery:v}=this;l.forEach(h=>{var $,w,N,z,G;if((($=h==null?void 0:h.type)===null||$===void 0?void 0:$.__GRID_ITEM__)!==!0)return;if(rt(h)){const E=oe(h);E.props?E.props.privateShow=!1:E.props={privateShow:!1},g.push({child:E,rawChildSpan:0});return}h.dirs=((w=h.dirs)===null||w===void 0?void 0:w.filter(({dir:E})=>E!==ge))||null,((N=h.dirs)===null||N===void 0?void 0:N.length)===0&&(h.dirs=null);const ee=oe(h),te=Number((G=W((z=ee.props)===null||z===void 0?void 0:z.span,v))!==null&&G!==void 0?G:fe);te!==0&&g.push({child:ee,rawChildSpan:te})});let p=0;const d=(t=g[g.length-1])===null||t===void 0?void 0:t.child;if(d!=null&&d.props){const h=(i=d.props)===null||i===void 0?void 0:i.suffix;h!==void 0&&h!==!1&&(p=Number((a=W((r=d.props)===null||r===void 0?void 0:r.span,v))!==null&&a!==void 0?a:fe),d.props.privateSpan=p,d.props.privateColStart=s+1-p,d.props.privateShow=(o=d.props.privateShow)!==null&&o!==void 0?o:!0)}let C=0,y=!1;for(const{child:h,rawChildSpan:$}of g){if(y&&(this.overflow=!0),!y){const w=Number((c=W((n=h.props)===null||n===void 0?void 0:n.offset,v))!==null&&c!==void 0?c:0),N=Math.min($+w,s);if(h.props?(h.props.privateSpan=N,h.props.privateOffset=w):h.props={privateSpan:N,privateOffset:w},b){const z=C%s;N+z>s&&(C+=s-z),N+C+p>S*s?y=!0:C+=N}}y&&(h.props?h.props.privateShow!==!0&&(h.props.privateShow=!1):h.props={privateShow:!1})}return u("div",ne({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style,[J]:this.isSsr||void 0},this.$attrs),g.map(({child:h})=>h))};return this.isResponsive&&this.responsive==="self"?u(De,{onResize:this.handleResize},{default:e}):e()}}),kt=e=>1-Math.pow(1-e,5);function Nt(e){const{from:t,to:i,duration:r,onUpdate:a,onFinish:o}=e,n=performance.now(),c=()=>{const l=performance.now(),g=Math.min(l-n,r),b=t+(i-t)*kt(g/r);if(g===r){o();return}a(b),requestAnimationFrame(c)};c()}const Bt={to:{type:Number,default:0},precision:{type:Number,default:0},showSeparator:Boolean,locale:String,from:{type:Number,default:0},active:{type:Boolean,default:!0},duration:{type:Number,default:2e3},onFinish:Function},zt=P({name:"NumberAnimation",props:Bt,setup(e){const{localeRef:t}=Qe("name"),{duration:i}=e,r=D(e.from),a=_(()=>{const{locale:s}=e;return s!==void 0?s:t.value});let o=!1;const n=s=>{r.value=s},c=()=>{var s;r.value=e.to,o=!1,(s=e.onFinish)===null||s===void 0||s.call(e)},l=(s=e.from,v=e.to)=>{o=!0,r.value=e.from,s!==v&&Nt({from:s,to:v,duration:i,onUpdate:n,onFinish:c})},g=_(()=>{var s;const p=mt(r.value,e.precision).toFixed(e.precision).split("."),d=new Intl.NumberFormat(a.value),C=(s=d.formatToParts(.5).find($=>$.type==="decimal"))===null||s===void 0?void 0:s.value,y=e.showSeparator?d.format(Number(p[0])):p[0],h=p[1];return{integer:y,decimal:h,decimalSeparator:C}});function b(){o||l()}return K(()=>{Te(()=>{e.active&&l()})}),Object.assign({formattedValue:g},{play:b})},render(){const{formattedValue:{integer:e,decimal:t,decimalSeparator:i}}=this;return[e,t?i:null,t]}}),Pt={success:u(xe,null),error:u(ye,null),warning:u(be,null),info:u(me,null)},It=P({name:"ProgressCircle",props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(e,{slots:t}){const i=_(()=>{const o="gradient",{fillColor:n}=e;return typeof n=="object"?`${o}-${Oe(JSON.stringify(n))}`:o});function r(o,n,c,l){const{gapDegree:g,viewBoxWidth:b,strokeWidth:S}=e,s=50,v=0,p=s,d=0,C=2*s,y=50+S/2,h=`M ${y},${y} m ${v},${p}
      a ${s},${s} 0 1 1 ${d},${-C}
      a ${s},${s} 0 1 1 ${-d},${C}`,$=Math.PI*2*s,w={stroke:l==="rail"?c:typeof e.fillColor=="object"?`url(#${i.value})`:c,strokeDasharray:`${Math.min(o,100)/100*($-g)}px ${b*8}px`,strokeDashoffset:`-${g/2}px`,transformOrigin:n?"center":void 0,transform:n?`rotate(${n}deg)`:void 0};return{pathString:h,pathStyle:w}}const a=()=>{const o=typeof e.fillColor=="object",n=o?e.fillColor.stops[0]:"",c=o?e.fillColor.stops[1]:"";return o&&u("defs",null,u("linearGradient",{id:i.value,x1:"0%",y1:"100%",x2:"100%",y2:"0%"},u("stop",{offset:"0%","stop-color":n}),u("stop",{offset:"100%","stop-color":c})))};return()=>{const{fillColor:o,railColor:n,strokeWidth:c,offsetDegree:l,status:g,percentage:b,showIndicator:S,indicatorTextColor:s,unit:v,gapOffsetDegree:p,clsPrefix:d}=e,{pathString:C,pathStyle:y}=r(100,0,n,"rail"),{pathString:h,pathStyle:$}=r(b,l,o,"fill"),w=100+c;return u("div",{class:`${d}-progress-content`,role:"none"},u("div",{class:`${d}-progress-graph`,"aria-hidden":!0},u("div",{class:`${d}-progress-graph-circle`,style:{transform:p?`rotate(${p}deg)`:void 0}},u("svg",{viewBox:`0 0 ${w} ${w}`},a(),u("g",null,u("path",{class:`${d}-progress-graph-circle-rail`,d:C,"stroke-width":c,"stroke-linecap":"round",fill:"none",style:y})),u("g",null,u("path",{class:[`${d}-progress-graph-circle-fill`,b===0&&`${d}-progress-graph-circle-fill--empty`],d:h,"stroke-width":c,"stroke-linecap":"round",fill:"none",style:$}))))),S?u("div",null,t.default?u("div",{class:`${d}-progress-custom-content`,role:"none"},t.default()):g!=="default"?u("div",{class:`${d}-progress-icon`,"aria-hidden":!0},u(ve,{clsPrefix:d},{default:()=>Pt[g]})):u("div",{class:`${d}-progress-text`,style:{color:s},role:"none"},u("span",{class:`${d}-progress-text__percentage`},b),u("span",{class:`${d}-progress-text__unit`},v))):null)}}}),Dt={success:u(xe,null),error:u(ye,null),warning:u(be,null),info:u(me,null)},Gt=P({name:"ProgressLine",props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:"%"},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(e,{slots:t}){const i=_(()=>M(e.height)),r=_(()=>{var n,c;return typeof e.fillColor=="object"?`linear-gradient(to right, ${(n=e.fillColor)===null||n===void 0?void 0:n.stops[0]} , ${(c=e.fillColor)===null||c===void 0?void 0:c.stops[1]})`:e.fillColor}),a=_(()=>e.railBorderRadius!==void 0?M(e.railBorderRadius):e.height!==void 0?M(e.height,{c:.5}):""),o=_(()=>e.fillBorderRadius!==void 0?M(e.fillBorderRadius):e.railBorderRadius!==void 0?M(e.railBorderRadius):e.height!==void 0?M(e.height,{c:.5}):"");return()=>{const{indicatorPlacement:n,railColor:c,railStyle:l,percentage:g,unit:b,indicatorTextColor:S,status:s,showIndicator:v,processing:p,clsPrefix:d}=e;return u("div",{class:`${d}-progress-content`,role:"none"},u("div",{class:`${d}-progress-graph`,"aria-hidden":!0},u("div",{class:[`${d}-progress-graph-line`,{[`${d}-progress-graph-line--indicator-${n}`]:!0}]},u("div",{class:`${d}-progress-graph-line-rail`,style:[{backgroundColor:c,height:i.value,borderRadius:a.value},l]},u("div",{class:[`${d}-progress-graph-line-fill`,p&&`${d}-progress-graph-line-fill--processing`],style:{maxWidth:`${e.percentage}%`,background:r.value,height:i.value,lineHeight:i.value,borderRadius:o.value}},n==="inside"?u("div",{class:`${d}-progress-graph-line-indicator`,style:{color:S}},t.default?t.default():`${g}${b}`):null)))),v&&n==="outside"?u("div",null,t.default?u("div",{class:`${d}-progress-custom-content`,style:{color:S},role:"none"},t.default()):s==="default"?u("div",{role:"none",class:`${d}-progress-icon ${d}-progress-icon--as-text`,style:{color:S}},g,b):u("div",{class:`${d}-progress-icon`,"aria-hidden":!0},u(ve,{clsPrefix:d},{default:()=>Dt[s]}))):null)}}});function pe(e,t,i=100){return`m ${i/2} ${i/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}const Et=P({name:"ProgressMultipleCircle",props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(e,{slots:t}){const i=_(()=>e.percentage.map((o,n)=>`${Math.PI*o/100*(e.viewBoxWidth/2-e.strokeWidth/2*(1+2*n)-e.circleGap*n)*2}, ${e.viewBoxWidth*8}`)),r=(a,o)=>{const n=e.fillColor[o],c=typeof n=="object"?n.stops[0]:"",l=typeof n=="object"?n.stops[1]:"";return typeof e.fillColor[o]=="object"&&u("linearGradient",{id:`gradient-${o}`,x1:"100%",y1:"0%",x2:"0%",y2:"100%"},u("stop",{offset:"0%","stop-color":c}),u("stop",{offset:"100%","stop-color":l}))};return()=>{const{viewBoxWidth:a,strokeWidth:o,circleGap:n,showIndicator:c,fillColor:l,railColor:g,railStyle:b,percentage:S,clsPrefix:s}=e;return u("div",{class:`${s}-progress-content`,role:"none"},u("div",{class:`${s}-progress-graph`,"aria-hidden":!0},u("div",{class:`${s}-progress-graph-circle`},u("svg",{viewBox:`0 0 ${a} ${a}`},u("defs",null,S.map((v,p)=>r(v,p))),S.map((v,p)=>u("g",{key:p},u("path",{class:`${s}-progress-graph-circle-rail`,d:pe(a/2-o/2*(1+2*p)-n*p,o,a),"stroke-width":o,"stroke-linecap":"round",fill:"none",style:[{strokeDashoffset:0,stroke:g[p]},b[p]]}),u("path",{class:[`${s}-progress-graph-circle-fill`,v===0&&`${s}-progress-graph-circle-fill--empty`],d:pe(a/2-o/2*(1+2*p)-n*p,o,a),"stroke-width":o,"stroke-linecap":"round",fill:"none",style:{strokeDasharray:i.value[p],strokeDashoffset:0,stroke:typeof l[p]=="object"?`url(#gradient-${p})`:l[p]}})))))),c&&t.default?u("div",null,u("div",{class:`${s}-progress-text`},t.default())):null)}}}),Mt=q([x("progress",{display:"inline-block"},[x("progress-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `),I("line",`
 width: 100%;
 display: block;
 `,[x("progress-content",`
 display: flex;
 align-items: center;
 `,[x("progress-graph",{flex:1})]),x("progress-custom-content",{marginLeft:"14px"}),x("progress-icon",`
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `,[I("as-text",`
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]),I("circle, dashboard",{width:"120px"},[x("progress-custom-content",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `),x("progress-text",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: inherit;
 font-size: var(--n-font-size-circle);
 color: var(--n-text-color-circle);
 font-weight: var(--n-font-weight-circle);
 transition: color .3s var(--n-bezier);
 white-space: nowrap;
 `),x("progress-icon",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]),I("multiple-circle",`
 width: 200px;
 color: inherit;
 `,[x("progress-text",`
 font-weight: var(--n-font-weight-circle);
 color: var(--n-text-color-circle);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `)]),x("progress-content",{position:"relative"}),x("progress-graph",{position:"relative"},[x("progress-graph-circle",[q("svg",{verticalAlign:"bottom"}),x("progress-graph-circle-fill",`
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `,[I("empty",{opacity:0})]),x("progress-graph-circle-rail",`
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]),x("progress-graph-line",[I("indicator-inside",[x("progress-graph-line-rail",`
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `,[x("progress-graph-line-fill",`
 height: inherit;
 border-radius: 10px;
 `),x("progress-graph-line-indicator",`
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]),I("indicator-inside-label",`
 height: 16px;
 display: flex;
 align-items: center;
 `,[x("progress-graph-line-rail",`
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `),x("progress-graph-line-indicator",`
 background: var(--n-fill-color);
 font-size: 12px;
 transform: translateZ(0);
 display: flex;
 vertical-align: middle;
 height: 16px;
 line-height: 16px;
 padding: 0 10px;
 border-radius: 10px;
 position: absolute;
 white-space: nowrap;
 color: var(--n-text-color-line-inner);
 transition:
 right .2s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),x("progress-graph-line-rail",`
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `,[x("progress-graph-line-fill",`
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `,[I("processing",[q("&::after",`
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]),q("@keyframes progress-processing-animation",`
 0% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 100%;
 opacity: 1;
 }
 66% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 100% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 `)]),jt=Object.assign(Object.assign({},U.props),{processing:Boolean,type:{type:String,default:"line"},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:"default"},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:"%"},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:"outside"},indicatorPlacement:{type:String,default:"outside"},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number}),Tt=P({name:"Progress",props:jt,setup(e){const t=_(()=>e.indicatorPlacement||e.indicatorPosition),i=_(()=>{if(e.gapDegree||e.gapDegree===0)return e.gapDegree;if(e.type==="dashboard")return 75}),{mergedClsPrefixRef:r,inlineThemeDisabled:a}=Z(e),o=U("Progress","-progress",Mt,yt,e,r),n=_(()=>{const{status:l}=e,{common:{cubicBezierEaseInOut:g},self:{fontSize:b,fontSizeCircle:S,railColor:s,railHeight:v,iconSizeCircle:p,iconSizeLine:d,textColorCircle:C,textColorLineInner:y,textColorLineOuter:h,lineBgProcessing:$,fontWeightCircle:w,[ae("iconColor",l)]:N,[ae("fillColor",l)]:z}}=o.value;return{"--n-bezier":g,"--n-fill-color":z,"--n-font-size":b,"--n-font-size-circle":S,"--n-font-weight-circle":w,"--n-icon-color":N,"--n-icon-size-circle":p,"--n-icon-size-line":d,"--n-line-bg-processing":$,"--n-rail-color":s,"--n-rail-height":v,"--n-text-color-circle":C,"--n-text-color-line-inner":y,"--n-text-color-line-outer":h}}),c=a?Se("progress",_(()=>e.status[0]),n,e):void 0;return{mergedClsPrefix:r,mergedIndicatorPlacement:t,gapDeg:i,cssVars:a?void 0:n,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){const{type:e,cssVars:t,indicatorTextColor:i,showIndicator:r,status:a,railColor:o,railStyle:n,color:c,percentage:l,viewBoxWidth:g,strokeWidth:b,mergedIndicatorPlacement:S,unit:s,borderRadius:v,fillBorderRadius:p,height:d,processing:C,circleGap:y,mergedClsPrefix:h,gapDeg:$,gapOffsetDegree:w,themeClass:N,$slots:z,onRender:G}=this;return G==null||G(),u("div",{class:[N,`${h}-progress`,`${h}-progress--${e}`,`${h}-progress--${a}`],style:t,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":l,role:e==="circle"||e==="line"||e==="dashboard"?"progressbar":"none"},e==="circle"||e==="dashboard"?u(It,{clsPrefix:h,status:a,showIndicator:r,indicatorTextColor:i,railColor:o,fillColor:c,railStyle:n,offsetDegree:this.offsetDegree,percentage:l,viewBoxWidth:g,strokeWidth:b,gapDegree:$===void 0?e==="dashboard"?75:0:$,gapOffsetDegree:w,unit:s},z):e==="line"?u(Gt,{clsPrefix:h,status:a,showIndicator:r,indicatorTextColor:i,railColor:o,fillColor:c,railStyle:n,percentage:l,processing:C,indicatorPlacement:S,unit:s,fillBorderRadius:p,railBorderRadius:v,height:d},z):e==="multiple-circle"?u(Et,{clsPrefix:h,strokeWidth:b,railColor:o,fillColor:c,railStyle:n,viewBoxWidth:g,percentage:l,showIndicator:r,circleGap:y},z):null)}}),Ot=x("statistic",[H("label",`
 font-weight: var(--n-label-font-weight);
 transition: .3s color var(--n-bezier);
 font-size: var(--n-label-font-size);
 color: var(--n-label-text-color);
 `),x("statistic-value",`
 margin-top: 4px;
 font-weight: var(--n-value-font-weight);
 `,[H("prefix",`
 margin: 0 4px 0 0;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-prefix-text-color);
 `,[x("icon",{verticalAlign:"-0.125em"})]),H("content",`
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-text-color);
 `),H("suffix",`
 margin: 0 0 0 4px;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-suffix-text-color);
 `,[x("icon",{verticalAlign:"-0.125em"})])])]),Wt=Object.assign(Object.assign({},U.props),{tabularNums:Boolean,label:String,value:[String,Number]}),Ft=P({name:"Statistic",props:Wt,slots:Object,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:i,mergedRtlRef:r}=Z(e),a=U("Statistic","-statistic",Ot,St,e,t),o=We("Statistic",r,t),n=_(()=>{const{self:{labelFontWeight:l,valueFontSize:g,valueFontWeight:b,valuePrefixTextColor:S,labelTextColor:s,valueSuffixTextColor:v,valueTextColor:p,labelFontSize:d},common:{cubicBezierEaseInOut:C}}=a.value;return{"--n-bezier":C,"--n-label-font-size":d,"--n-label-font-weight":l,"--n-label-text-color":s,"--n-value-font-weight":b,"--n-value-font-size":g,"--n-value-prefix-text-color":S,"--n-value-suffix-text-color":v,"--n-value-text-color":p}}),c=i?Se("statistic",void 0,n,e):void 0;return{rtlEnabled:o,mergedClsPrefix:t,cssVars:i?void 0:n,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){var e;const{mergedClsPrefix:t,$slots:{default:i,label:r,prefix:a,suffix:o}}=this;return(e=this.onRender)===null||e===void 0||e.call(this),u("div",{class:[`${t}-statistic`,this.themeClass,this.rtlEnabled&&`${t}-statistic--rtl`],style:this.cssVars},X(r,n=>u("div",{class:`${t}-statistic__label`},this.label||n)),u("div",{class:`${t}-statistic-value`,style:{fontVariantNumeric:this.tabularNums?"tabular-nums":""}},X(a,n=>n&&u("span",{class:`${t}-statistic-value__prefix`},n)),this.value!==void 0?u("span",{class:`${t}-statistic-value__content`},this.value):X(i,n=>n&&u("span",{class:`${t}-statistic-value__content`},n)),X(o,n=>n&&u("span",{class:`${t}-statistic-value__suffix`},n))))}});function At(){const e=Ue(),t=D(!1),i=D(null),r=_(()=>i.value?Object.entries(i.value.stage_breakdown).filter(([,s])=>s>0).map(([s,v])=>({stage:s,label:Xe[s]??s,count:v,percentage:i.value&&i.value.total_count>0?Number((v/i.value.total_count*100).toFixed(1)):0})).sort((s,v)=>v.count-s.count):[]),a=_(()=>r.value[0]??null),o=_(()=>{var v;if(!((v=i.value)!=null&&v.daily_trend))return 1;let s=1;for(const p of i.value.daily_trend){const d=p.submitted+p.approved+p.rejected+p.deleted;d>s&&(s=d)}return s}),n=_(()=>{var v;if(!((v=i.value)!=null&&v.hourly_distribution))return 1;let s=1;for(const p of i.value.hourly_distribution)p.count>s&&(s=p.count);return s});function c(s){return Math.max(2,Math.round(s/o.value*120))}function l(s){return Math.max(2,Math.round(s/n.value*80))}function g(s){return s<6e4?Math.round(s/1e3)+" 秒":s<36e5?(s/6e4).toFixed(1)+" 分钟":(s/36e5).toFixed(2)+" 小时"}const b=_(()=>i.value?[{label:"今日投稿",value:i.value.today_count,tone:"default",hint:"自然日内新增入库稿件"},{label:"待审核",value:i.value.pending_count,tone:"warning",hint:"仍需人工确认的稿件"},{label:"累计总数",value:i.value.total_count,tone:"default",hint:"当前状态视图中的总稿件数"}]:[]);async function S(){t.value=!0;try{i.value=await Fe("/api/stats")}catch(s){e.error(s.message)}finally{t.value=!1}}return{loading:t,stats:i,stageEntries:r,leadStage:a,trendMaxValue:o,hourlyMaxCount:n,trendBarHeight:c,hourlyBarHeight:l,formatDuration:g,cardMetrics:b,loadStats:S}}const Vt={class:"stats-container"},Lt={class:"stats-hero"},qt={class:"hero-side"},Ht={key:0,class:"loading-wrap"},Xt={key:1,class:"dashboard"},Yt={class:"stat-label"},Qt={class:"distribution-panel"},Ut={class:"panel-head"},Jt={class:"panel-note"},Zt={class:"progress-list"},Kt={class:"label-block"},er={class:"bar"},tr={key:0,class:"distribution-panel"},rr={class:"trend-chart"},ir={class:"trend-bars"},nr={class:"trend-bar-label"},or={class:"trend-bar-stack"},sr=["title"],ar=["title"],lr=["title"],cr=["title"],ur={class:"trend-bar-value"},dr={key:1,class:"distribution-panel"},fr={class:"hourly-grid"},pr={class:"hourly-label"},gr={class:"hourly-count"},hr={key:2,class:"distribution-panel"},vr={class:"efficiency-card"},mr={class:"efficiency-value"},br={key:3,class:"distribution-panel"},yr=P({__name:"StatsPage",setup(e){const t=At();return K(()=>{t.loadStats()}),(i,r)=>{var a,o,n,c;return R(),k("div",Vt,[f("section",Lt,[r[1]||(r[1]=f("div",null,[f("span",{class:"hero-kicker"},"数据报表"),f("h1",null,"查看投稿趋势、时段分布和审核效率。"),f("p",null,"用于了解整体运营状态和团队处理效率。")],-1)),f("div",qt,[m(t).leadStage.value?(R(),le(m(Ae),{key:0,round:"",bordered:!1,type:"warning"},{default:j(()=>[ce(" 占比最高："+B(m(t).leadStage.value.label)+" "+B(m(t).leadStage.value.percentage)+"% ",1)]),_:1})):T("",!0),f("button",{class:"refresh-btn",onClick:r[0]||(r[0]=l=>m(t).loadStats())},"刷新数据")])]),m(t).loading.value&&!m(t).stats.value?(R(),k("div",Ht,[O(m(Ye),{size:"large"})])):m(t).stats.value?(R(),k("div",Xt,[O(m(Rt),{"x-gap":"14","y-gap":"14",cols:"1 s:2 m:3",responsive:"screen"},{default:j(()=>[(R(!0),k(Y,null,Q(m(t).cardMetrics.value,l=>(R(),le(m(Ct),{key:l.label},{default:j(()=>[O(m(Je),{class:"stat-card",bordered:!1},{default:j(()=>[f("span",Yt,B(l.label),1),O(m(Ft),null,{default:j(()=>[O(m(zt),{from:0,to:l.value},null,8,["to"])]),_:2},1024),f("p",null,B(l.hint),1)]),_:2},1024)]),_:2},1024))),128))]),_:1}),f("section",Qt,[f("div",Ut,[r[2]||(r[2]=f("div",null,[f("span",{class:"panel-kicker"},"阶段结构"),f("h2",null,"各阶段分布")],-1)),f("span",Jt,"总稿件 "+B(m(t).stats.value.total_count)+" 条",1)]),f("div",Zt,[(R(!0),k(Y,null,Q(m(t).stageEntries.value,l=>(R(),k("div",{key:l.stage,class:"progress-item"},[f("div",Kt,[f("strong",null,B(l.label),1),f("span",null,B(l.count)+" 条",1)]),f("div",er,[O(m(Tt),{type:"line",percentage:l.percentage,height:18,color:l.stage==="review_pending"?"#f59e0b":"#3b82f6"},{default:j(()=>[ce(B(l.percentage)+"% ",1)]),_:2},1032,["percentage","color"])])]))),128))])]),(a=m(t).stats.value.daily_trend)!=null&&a.length?(R(),k("section",tr,[r[4]||(r[4]=f("div",{class:"panel-head"},[f("div",null,[f("span",{class:"panel-kicker"},"投稿趋势"),f("h2",null,"近7天投稿趋势")]),f("span",{class:"panel-note"},"提交 · 通过 · 拒绝 · 删除")],-1)),f("div",rr,[f("div",ir,[(R(!0),k(Y,null,Q(m(t).stats.value.daily_trend,l=>(R(),k("div",{key:l.date,class:"trend-bar-group"},[f("div",nr,B(l.date.slice(5)),1),f("div",or,[f("div",{class:"trend-bar submitted",style:A({height:m(t).trendBarHeight(l.submitted)+"px"}),title:"提交: "+l.submitted},null,12,sr),f("div",{class:"trend-bar approved",style:A({height:m(t).trendBarHeight(l.approved)+"px"}),title:"通过: "+l.approved},null,12,ar),f("div",{class:"trend-bar rejected",style:A({height:m(t).trendBarHeight(l.rejected)+"px"}),title:"拒绝: "+l.rejected},null,12,lr),f("div",{class:"trend-bar deleted",style:A({height:m(t).trendBarHeight(l.deleted)+"px"}),title:"删除: "+l.deleted},null,12,cr)]),f("div",ur,B(l.submitted),1)]))),128))]),r[3]||(r[3]=Ve('<div class="trend-legend" data-v-be0a7ce5><span class="legend-dot submitted" data-v-be0a7ce5></span> 提交 <span class="legend-dot approved" data-v-be0a7ce5></span> 通过 <span class="legend-dot rejected" data-v-be0a7ce5></span> 拒绝 <span class="legend-dot deleted" data-v-be0a7ce5></span> 删除 </div>',1))])])):T("",!0),(o=m(t).stats.value.hourly_distribution)!=null&&o.length?(R(),k("section",dr,[r[5]||(r[5]=f("div",{class:"panel-head"},[f("div",null,[f("span",{class:"panel-kicker"},"时段分布"),f("h2",null,"24小时提交分布")])],-1)),f("div",fr,[(R(!0),k(Y,null,Q(m(t).stats.value.hourly_distribution,l=>(R(),k("div",{key:l.hour,class:Le(["hourly-cell",{peak:l.count>=m(t).hourlyMaxCount.value*.7}])},[f("div",{class:"hourly-bar",style:A({height:m(t).hourlyBarHeight(l.count)+"px"})},null,4),f("span",pr,B(String(l.hour).padStart(2,"0")),1),f("span",gr,B(l.count),1)],2))),128))])])):T("",!0),m(t).stats.value.avg_review_time_ms?(R(),k("section",hr,[r[7]||(r[7]=f("div",{class:"panel-head"},[f("div",null,[f("span",{class:"panel-kicker"},"审核效率"),f("h2",null,"平均审核时长")])],-1)),f("div",vr,[f("div",mr,B(m(t).formatDuration(m(t).stats.value.avg_review_time_ms)),1),r[6]||(r[6]=f("span",{class:"efficiency-hint"},"从投稿提交到审核完成的平均耗时",-1))])])):T("",!0),!((n=m(t).stats.value.daily_trend)!=null&&n.length)&&!((c=m(t).stats.value.hourly_distribution)!=null&&c.length)?(R(),k("section",br,[...r[8]||(r[8]=[f("p",{style:{color:"rgba(30,41,59,0.54)","text-align":"center",padding:"24px 0"}}," 暂无趋势数据。当有更多稿件时，这里将展示投稿趋势、时段分布和审核效率。 ",-1)])])):T("",!0)])):T("",!0)])}}}),Cr=qe(yr,[["__scopeId","data-v-be0a7ce5"]]);export{Cr as default};
