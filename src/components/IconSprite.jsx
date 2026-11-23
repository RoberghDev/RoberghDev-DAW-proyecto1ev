import React from 'react';
import { EMBLEMA } from './emblema.js';
export default function IconSprite() {
 return (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
   <defs>
    <linearGradient id="cuGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4cdab"/><stop offset=".32" stopColor="#cb8c60"/><stop offset=".58" stopColor="#ebb893"/><stop offset="1" stopColor="#8e512d"/></linearGradient>
    <symbol id="emblem" viewBox="0 0 100 100"><path id="emblemPath" fill="url(#cuGrad)" fillRule="evenodd" d={EMBLEMA}/></symbol>
    <symbol id={'i-search'} viewBox={'0 0 24 24'}><circle cx={'10.5'} cy={'10.5'} r={'6.5'}/><path d={'M15.5 15.5 21 21'}/></symbol>
<symbol id={'i-user'} viewBox={'0 0 24 24'}><circle cx={'12'} cy={'8'} r={'4'}/><path d={'M4 21c1.3-4.2 4.4-6.3 8-6.3s6.7 2.1 8 6.3'}/></symbol>
<symbol id={'i-heart'} viewBox={'0 0 24 24'}><path d={'M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z'}/></symbol>
<symbol id={'i-bag'} viewBox={'0 0 24 24'}><path d={'M5 8h14l-1 12.5H6L5 8z'}/><path d={'M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8'}/></symbol>
<symbol id={'i-menu'} viewBox={'0 0 24 24'}><path d={'M3 7h18M3 12h18M3 17h12'}/></symbol>
<symbol id={'i-close'} viewBox={'0 0 24 24'}><path d={'M5 5l14 14M19 5 5 19'}/></symbol>
<symbol id={'i-left'} viewBox={'0 0 24 24'}><path d={'M20 12H4M10 6l-6 6 6 6'}/></symbol>
<symbol id={'i-right'} viewBox={'0 0 24 24'}><path d={'M4 12h16M14 6l6 6-6 6'}/></symbol>
<symbol id={'i-up'} viewBox={'0 0 24 24'}><path d={'M12 20V4M6 10l6-6 6 6'}/></symbol>
<symbol id={'i-rotate'} viewBox={'0 0 24 24'}><path d={'M20 12a8 8 0 1 1-2.6-5.9'}/><path d={'M20 4v4.5h-4.5'}/></symbol>
<symbol id={'i-drag'} viewBox={'0 0 24 24'}><path d={'M8 8 4 12l4 4M16 8l4 4-4 4M4 12h16'}/></symbol>
<symbol id={'i-plus'} viewBox={'0 0 24 24'}><path d={'M12 5v14M5 12h14'}/></symbol>
<symbol id={'i-minus'} viewBox={'0 0 24 24'}><path d={'M5 12h14'}/></symbol>
<symbol id={'i-check'} viewBox={'0 0 24 24'}><path d={'m5 12.5 4.5 4.5L19 7.5'}/></symbol>
<symbol id={'i-trash'} viewBox={'0 0 24 24'}><path d={'M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6'}/></symbol>
<symbol id={'i-filter'} viewBox={'0 0 24 24'}><path d={'M4 6h16M7 12h10M10 18h4'}/></symbol>
<symbol id={'i-mail'} viewBox={'0 0 24 24'}><rect x={'3'} y={'5.5'} width={'18'} height={'13'} rx={'1.5'}/><path d={'m3.5 6.5 8.5 6.5 8.5-6.5'}/></symbol>
<symbol id={'i-phone'} viewBox={'0 0 24 24'}><path d={'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z'}/></symbol>
<symbol id={'i-clock'} viewBox={'0 0 24 24'}><circle cx={'12'} cy={'12'} r={'8.5'}/><path d={'M12 7.5V12l3 2'}/></symbol>
<symbol id={'i-box'} viewBox={'0 0 24 24'}><path d={'M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z'}/><path d={'M3.5 7.5 12 12l8.5-4.5M12 12v9'}/></symbol>
<symbol id={'i-truck'} viewBox={'0 0 32 32'}><path d={'M3 8h16v14H3zM19 13h6l4 5v4h-10'}/><circle cx={'9'} cy={'23.5'} r={'2.5'}/><circle cx={'24'} cy={'23.5'} r={'2.5'}/></symbol>
<symbol id={'i-return'} viewBox={'0 0 32 32'}><path d={'M9 11h13a6 6 0 0 1 0 12H11'}/><path d={'m13 6-5 5 5 5'}/></symbol>
<symbol id={'i-shield'} viewBox={'0 0 32 32'}><path d={'M16 3.5 26 7v8c0 6.5-4.3 11-10 13.5C10.3 26 6 21.5 6 15V7z'}/><path d={'m11.5 15.5 3.2 3.2 6-6.4'}/></symbol>
<symbol id={'i-cert'} viewBox={'0 0 32 32'}><circle cx={'16'} cy={'13'} r={'8'}/><path d={'m12.6 13 2.4 2.4 4.4-4.6M11 19.5 9 28l7-3 7 3-2-8.5'}/></symbol>
<symbol id={'i-lock'} viewBox={'0 0 32 32'}><rect x={'7'} y={'14'} width={'18'} height={'13'} rx={'1.5'}/><path d={'M11 14v-3.5a5 5 0 0 1 10 0V14M16 19v3'}/></symbol>
<symbol id={'i-gear'} viewBox={'0 0 32 32'}><circle cx={'16'} cy={'16'} r={'4'}/><path d={'M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8'}/><circle cx={'16'} cy={'16'} r={'9'}/></symbol>
<symbol id={'i-hand'} viewBox={'0 0 32 32'}><path d={'M6 26 18 14M17 9l6 6M20.5 5.5l6 6-3.5 3.5-6-6z'}/><path d={'M6 26l-1.5 1.5'}/></symbol>
<symbol id={'i-diamond'} viewBox={'0 0 32 32'}><path d={'M9 6h14l5 7-12 14L4 13z'}/><path d={'M4 13h24M12.5 6 16 27l3.5-21'}/></symbol>
<symbol id={'i-hourglass'} viewBox={'0 0 32 32'}><path d={'M9 4h14M9 28h14M10 4c0 7 12 7 12 12s-12 5-12 12M22 4c0 7-12 7-12 12'}/><path d={'M22 28c0-4-4-6-6-6s-6 2-6 6'}/></symbol>
<symbol id={'i-pen'} viewBox={'0 0 24 24'}><path d={'M4 20l3.5-.8L19 7.7 16.3 5 4.8 16.5z'}/><path d={'M14.5 6.8l2.7 2.7'}/></symbol>
<symbol id={'i-wrench'} viewBox={'0 0 24 24'}><path d={'M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.4-.6-.6-2.4z'}/></symbol>
<symbol id={'i-link'} viewBox={'0 0 24 24'}><rect x={'4'} y={'3'} width={'7'} height={'6'} rx={'1'}/><rect x={'13'} y={'9'} width={'7'} height={'6'} rx={'1'}/><rect x={'4'} y={'15'} width={'7'} height={'6'} rx={'1'}/><path d={'M11 6h3v3M13 12h-2v3'}/></symbol>
<symbol id={'i-gift'} viewBox={'0 0 24 24'}><rect x={'3.5'} y={'9'} width={'17'} height={'11.5'}/><path d={'M2.5 9h19M12 9v11.5M12 9c-1.5-3.5-6-4.5-6-2s4 2 6 2c2 0 6 .5 6-2s-4.5-1.5-6 2'}/></symbol>
<symbol id={'i-ig'} viewBox={'0 0 24 24'}><rect x={'3.5'} y={'3.5'} width={'17'} height={'17'} rx={'5'}/><circle cx={'12'} cy={'12'} r={'4'}/><circle cx={'17.2'} cy={'6.8'} r={'.6'}/></symbol>
<symbol id={'i-fb'} viewBox={'0 0 24 24'}><path d={'M14 21v-8h2.8l.5-3.3H14V7.8c0-1 .4-1.8 1.8-1.8h1.6V3.2c-.6-.1-1.6-.2-2.6-.2-2.6 0-4.3 1.5-4.3 4.4v2.4H7.7V13h2.8v8'}/></symbol>
<symbol id={'i-yt'} viewBox={'0 0 24 24'}><rect x={'2.5'} y={'5.5'} width={'19'} height={'13'} rx={'3.5'}/><path d={'m10 9.2 5 2.8-5 2.8z'}/></symbol>
<symbol id={'i-pinterest'} viewBox={'0 0 24 24'}><circle cx={'12'} cy={'12'} r={'9'}/><path d={'M11 8.5h2a2.8 2.8 0 0 1 0 5.6h-2.2M11.6 8.5 9.5 19'}/></symbol>
   </defs>
  </svg>
 );
}
