const sampleProducts = [
  {code:"GLORYA-01", name:"GLORYA", detail:"Yüzey mermer · Gövde bonj", qty:1, price:8250, image:""},
  {code:"GLORYA-02", name:"GLORYA", detail:"Yüzey mermer · Gövde füme", qty:1, price:8250, image:""},
  {code:"GLORYA-03", name:"GLORYA", detail:"Yüzey aytaşı · Gövde bonj", qty:1, price:7750, image:""},
  {code:"PETRA-01", name:"PETRA", detail:"Aynalı yüzey · Füme bonj", qty:1, price:12500, image:""},
  {code:"LUNA-01", name:"LUNA", detail:"Ceviz", qty:1, price:7750, image:""},
  {code:"ELIPS-01", name:"ELİPS", detail:"160×95 cm yüzey mermer desen · Ayak aytaşı bonj", qty:1, price:10500, image:""},
  {code:"NUR-01", name:"NUR", detail:"160×90 cm ayak aytaşı bonj", qty:1, price:10500, image:""},
  {code:"ESTA-01", name:"ESTA", detail:"Aytaşı çember bonj", qty:1, price:7750, image:""},
  {code:"ESTA-02", name:"ESTA", detail:"Aytaşı çember ceviz", qty:1, price:7750, image:""}
];

const productsEl = document.getElementById("products");

function money(n){
  return new Intl.NumberFormat("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+" TL";
}

function addProduct(p = {code:"",name:"",detail:"",qty:1,price:0,image:""}){
  const index = productsEl.children.length + 1;
  const wrap = document.createElement("div");
  wrap.className = "row-wrap";
  wrap.innerHTML = `
    <div class="product-row">
      <div class="cell">${index}</div>
      <div class="cell">
        <input type="file" accept="image/*" class="img-upload no-print" title="Ürün görseli seç" style="display:none">
        <img class="product-image" alt="">
      </div>
      <div class="cell left"><input class="product-input" value="${p.name||""}" aria-label="Ürün ismi"></div>
      <div class="cell left"><input class="product-input" value="${p.detail||""}" aria-label="Detaylar"></div>
      <div class="cell"><input class="product-input center qty" type="number" min="0" value="${p.qty ?? 1}" aria-label="Adet"></div>
      <div class="cell price"><input class="product-input right price-input" type="number" min="0" step="0.01" value="${p.price ?? 0}" aria-label="Birim fiyat"></div>
      <div class="cell total">0,00 TL</div>
    </div>
    <button class="remove no-print" type="button" aria-label="Ürünü sil" title="Ürünü sil">×</button>
  `;
  productsEl.appendChild(wrap);

  wrap.querySelector(".remove").addEventListener("click", ()=>{
    wrap.remove();
    renumber();
    calculate();
  });

  const img = wrap.querySelector(".product-image");
  if(p.image){
    img.src = p.image;
    img.style.opacity = "1";
  } else {
    img.style.opacity = "0";
    img.addEventListener("click",()=>wrap.querySelector(".img-upload").click());
  }

  wrap.querySelector(".img-upload").addEventListener("change", e=>{
    const f=e.target.files[0];
    if(!f) return;
    const r=new FileReader();
    r.onload=()=>{img.src=r.result;img.style.opacity="1";};
    r.readAsDataURL(f);
  });

  wrap.querySelectorAll("input").forEach(i=>i.addEventListener("input",calculate));
  calculate();
}

function renumber(){
  [...productsEl.children].forEach((w,i)=>w.querySelector(".cell").textContent=i+1);
}

function calculate(){
  let subtotal=0;
  [...productsEl.children].forEach(w=>{
    const qty=Number(w.querySelector(".qty").value)||0;
    const price=Number(w.querySelector(".price-input").value)||0;
    const total=qty*price;
    subtotal+=total;
    w.querySelector(".total").textContent=money(total);
  });

  const depositRate=Number(document.getElementById("depositRate").value)||0;
  const grand=subtotal;
  const deposit=grand*depositRate/100;
  const balance=grand-deposit;

  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("grandTotal").textContent=money(grand);
  document.getElementById("deposit").textContent=money(deposit);
  document.getElementById("balance").textContent=money(balance);
}

document.querySelectorAll("input,textarea").forEach(i=>i.addEventListener("input",calculate));

document.getElementById("date").value = "2026-09-04";
document.getElementById("delivery").value = "2026-09-16";
sampleProducts.forEach(addProduct);
calculate();
