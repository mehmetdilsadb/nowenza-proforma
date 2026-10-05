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
const translations = {
  tr: {
    toolbarHint:"— verileri doldur, PDF al", addProduct:"+ Ürün Ekle", print:"PDF / Yazdır",
    title:"PROFORMA FATURA", date:"TARİH", delivery:"TESLİM", seller:"SATICI BİLGİLERİ", buyer:"ALICI BİLGİLERİ",
    company:"FİRMA", address:"ADRES", whatsapp:"WHATSAPP", phone:"TELEFON", email:"E-MAİL", web:"WEB", contact:"İLGİLİ KİŞİ",
    taxOffice:"VERGİ DAİRESİ", taxNo:"VERGİ NO", bankInfo:"BANKA BİLGİLERİ", bank:"BANKA", account:"HESAP", iban:"IBAN",
    descriptionName:"AÇIKLAMA / İSİM", shipping:"NAKLİYE", image:"GÖRSEL", productName:"ÜRÜN İSMİ", details:"DETAYLAR", qty:"ADET",
    unitPrice:"BİRİM FİYAT", total:"TOPLAM", note:"NOT", subtotal:"TOPLAM", grandTotal:"GENEL TOPLAM", deposit:"ÖN ÖDEME (%)",
    balance:"KALAN BAKİYE", stampSignature:"KAŞE VE İMZA", customerApproval:"MÜŞTERİ ONAYI",
    noteText:"Sipariş geçildiğinde %30 ön ödeme alınır.\nÜrün hazırlığı bittiğinde tarafınıza haber verilir.\nKalan ödeme tahsil edildikten sonra sevkiyatı yapılır.\nFiyatlarımız en az 500 adet alım için geçerlidir."
  },
  en: {
    toolbarHint:"— fill in the details and export PDF", addProduct:"+ Add Product", print:"PDF / Print",
    title:"PROFORMA INVOICE", date:"DATE", delivery:"DELIVERY", seller:"SELLER INFORMATION", buyer:"BUYER INFORMATION",
    company:"COMPANY", address:"ADDRESS", whatsapp:"WHATSAPP", phone:"PHONE", email:"E-MAIL", web:"WEB", contact:"CONTACT PERSON",
    taxOffice:"TAX OFFICE", taxNo:"TAX NO.", bankInfo:"BANK INFORMATION", bank:"BANK", account:"ACCOUNT", iban:"IBAN",
    descriptionName:"DESCRIPTION / NAME", shipping:"SHIPPING", image:"IMAGE", productName:"PRODUCT NAME", details:"DETAILS", qty:"QTY",
    unitPrice:"UNIT PRICE", total:"TOTAL", note:"NOTES", subtotal:"TOTAL", grandTotal:"GRAND TOTAL", deposit:"ADVANCE PAYMENT (%)",
    balance:"BALANCE", stampSignature:"STAMP & SIGNATURE", customerApproval:"CUSTOMER APPROVAL",
    noteText:"30% advance payment is required when the order is placed.\nYou will be notified when the products are ready.\nShipment will be made after the remaining payment is collected.\nOur prices are valid for orders of at least 500 units."
  }
};
let currentLanguage = "tr";

function money(n){
  const locale = currentLanguage === "en" ? "en-US" : "tr-TR";
  const currency = currentLanguage === "en" ? " TL" : " TL";
  return new Intl.NumberFormat(locale,{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+currency;
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
      <div class="cell left"><input class="product-input" value="${p.name||""}"></div>
      <div class="cell left"><input class="product-input" value="${p.detail||""}"></div>
      <div class="cell"><input class="product-input center qty" type="number" min="0" value="${p.qty ?? 1}"></div>
      <div class="cell price"><input class="product-input right price-input" type="number" min="0" step="0.01" value="${p.price ?? 0}"></div>
      <div class="cell total">0,00 TL</div>
    </div>
    <button class="remove no-print" type="button" aria-label="Remove product" onclick="this.parentElement.remove(); renumber(); calculate();">×</button>
  `;
  productsEl.appendChild(wrap);
  const img = wrap.querySelector(".product-image");
  if(p.image){ img.src = p.image; }
  else {
    img.style.opacity = "0";
    img.addEventListener("click",()=>wrap.querySelector(".img-upload").click());
  }
  wrap.querySelector(".img-upload").addEventListener("change", e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{img.src=r.result;img.style.opacity="1";};
    r.readAsDataURL(f);
  });
  wrap.querySelectorAll("input").forEach(i=>i.addEventListener("input",calculate));
  calculate();
}
function renumber(){ [...productsEl.children].forEach((w,i)=>w.querySelector(".cell").textContent=i+1); }
function calculate(){
  let subtotal=0;
  [...productsEl.children].forEach(w=>{
    const qty=Number(w.querySelector(".qty").value)||0;
    const price=Number(w.querySelector(".price-input").value)||0;
    const total=qty*price; subtotal+=total;
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
function setLanguage(lang){
  if(!translations[lang]) return;
  currentLanguage=lang;
  document.documentElement.lang=lang;
  const t=translations[lang];
  document.getElementById("toolbarHint").textContent=t.toolbarHint;
  document.getElementById("addProductBtn").textContent=t.addProduct;
  document.getElementById("printBtn").textContent=t.print;
  document.getElementById("invoiceTitle").textContent=t.title;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n; if(t[key]) el.textContent=t[key];
  });
  document.getElementById("note").value=t.noteText;
  document.querySelectorAll(".lang-btn").forEach(btn=>btn.classList.toggle("active",btn.dataset.lang===lang));
  calculate();
}

document.querySelectorAll("input,textarea").forEach(i=>i.addEventListener("input",calculate));
document.getElementById("date").value = "2026-09-04";
document.getElementById("delivery").value = "2026-09-16";
sampleProducts.forEach(addProduct);
setLanguage("tr");
