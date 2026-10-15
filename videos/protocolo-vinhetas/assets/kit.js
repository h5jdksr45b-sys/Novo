// Peças de movimento compartilhadas pelas vinhetas. Tudo entra numa única timeline pausada.
window.Kit = {
  // Fundo vivo: manchas derivando devagar e granulação em passos
  fundo(tl, dur) {
    tl.fromTo(".m1", { x: 0, y: 0 }, { x: 70, y: 50, duration: dur, ease: "sine.inOut" }, 0);
    tl.fromTo(".m2", { x: 0, y: 0 }, { x: -80, y: -40, duration: dur, ease: "sine.inOut" }, 0);
    tl.fromTo(".m3", { x: 0, scale: 1 }, { x: -60, scale: 1.15, duration: dur, ease: "sine.inOut" }, 0);
    tl.fromTo(".grao", { backgroundPosition: "0px 0px" }, { backgroundPosition: "256px 512px", duration: dur, ease: "steps(" + Math.round(dur * 12) + ")" }, 0);
  },

  selo(tl, t) {
    tl.fromTo(".selo span", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, t);
  },

  // Linha entra deslizando por trás de uma máscara
  linha(tl, sel, t) {
    tl.fromTo(sel, { x: -60, opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
      { x: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.out" }, t);
  },

  sairFrases(tl, sel, t) {
    tl.to(sel, { x: 40, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.04 }, t);
  },

  // Deslize em dois painéis; a troca de cena acontece quando o painel escuro cobre a tela
  deslize(tl, t) {
    tl.fromTo(".p1", { x: -1600, skewX: -12 }, { x: 1000, skewX: -12, duration: 0.7, ease: "power3.inOut" }, t);
    tl.fromTo(".p2", { x: -1600, skewX: -12 }, { x: 1000, skewX: -12, duration: 0.7, ease: "power3.inOut" }, t + 0.09);
    return t + 0.44; // instante em que a tela está coberta
  },

  // Traço que se desenha (paths com pathLength="1")
  desenhar(tl, sel, t, d = 0.6, stagger = 0) {
    tl.fromTo(sel, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power2.inOut", stagger }, t);
  },

  surgir(tl, sel, t, d = 0.4) {
    tl.fromTo(sel, { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: d, ease: "back.out(2)" }, t);
  },

  cartela(tl, t) {
    tl.fromTo(".cartela .rotulo", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, t);
    tl.fromTo(".cartela .numero", { y: 120, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.out" }, t + 0.1);
    tl.fromTo(".cartela .traco", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, t + 0.45);
    tl.fromTo(".cartela .titulo", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, t + 0.6);
  },

  assinatura(tl, t) {
    tl.fromTo(".assinatura > span", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: "power2.out" }, t);
  },

  // Aproximação lenta no fim para a cena não congelar
  respiro(tl, sel, t, d) {
    tl.fromTo(sel, { scale: 1 }, { scale: 1.035, duration: d, ease: "sine.inOut" }, t);
  },
};
