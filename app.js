const header = document.querySelector('.site-header');
const navToggle = document.querySelector('#navToggle');
const mobileNav = document.querySelector('#mobileNav');
const form = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
const scaleOptions = document.querySelectorAll('.scale-option');
const scaleCopy = document.querySelector('#scaleCopy');
const scaleCare = document.querySelector('#scaleCare');
const scaleOperations = document.querySelector('#scaleOperations');
const scaleFinance = document.querySelector('#scaleFinance');
const navLinks = document.querySelectorAll('.desktop-nav a');
const languageToggle = document.querySelector('#languageToggle');

// Configure these when a CRM, booking tool, or backend endpoint is approved.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'info@theonedigit.com';

let activeLanguage = 'ar';
const scaleDetails = {
  en: {
    facility: ['Run one facility’s patient journey—registration through billing—on one connected, governed workspace.', 'Registration → care → discharge', 'Live queues and resource status', 'Billing clarity at point of service'],
    network: ['Coordinate shared capacity, services, and operating standards across a multi-site provider network.', 'Consistent workflows across facilities', 'Shared capacity and network visibility', 'Consolidated finance and controls'],
    programme: ['Support decentralised service delivery and programme visibility across public-health operations.', 'Programme pathways across services', 'Field-to-central operational visibility', 'Auditable claims and reporting'],
  },
  ar: {
    facility: ['أدر رحلة المريض في منشأة واحدة، من التسجيل إلى الفوترة، ضمن مساحة عمل موحّدة ومحكومة.', 'التسجيل ← الرعاية ← الخروج', 'قوائم انتظار وحالة موارد مباشرة', 'وضوح الفوترة عند نقطة تقديم الخدمة'],
    network: ['نسّق السعة والخدمات ومعايير التشغيل المشتركة عبر شبكة متعددة المنشآت.', 'مسارات عمل موحّدة عبر المنشآت', 'رؤية مشتركة للسعة والشبكة', 'ضوابط مالية موحّدة ومجمّعة'],
    programme: ['ادعم تقديم الخدمات اللامركزي ورؤية البرامج عبر عمليات الصحة العامة.', 'مسارات برامج عبر الخدمات', 'رؤية تشغيلية من الميدان إلى المركز', 'مطالبات وتقارير قابلة للتدقيق'],
  },
};

const originalContent = new Map();
const originalAttributes = new Map();
const originalTitle = document.title;
const originalDescription = document.querySelector('meta[name="description"]')?.content;

function setContent(selector, values, useHtml = false) {
  const elements = [...document.querySelectorAll(selector)];
  const content = Array.isArray(values) ? values : [values];
  elements.forEach((element, index) => {
    if (!originalContent.has(element)) originalContent.set(element, element.innerHTML);
    const value = content[index] ?? content[content.length - 1];
    if (useHtml) element.innerHTML = value;
    else element.textContent = value;
  });
}

function setAttribute(selector, attribute, values) {
  const elements = [...document.querySelectorAll(selector)];
  const content = Array.isArray(values) ? values : [values];
  elements.forEach((element, index) => {
    if (!originalAttributes.has(element)) originalAttributes.set(element, new Map());
    const attributes = originalAttributes.get(element);
    if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute));
    element.setAttribute(attribute, content[index] ?? content[content.length - 1]);
  });
}

function restoreEnglish() {
  originalContent.forEach((content, element) => { element.innerHTML = content; });
  originalAttributes.forEach((attributes, element) => {
    attributes.forEach((value, attribute) => {
      if (value === null) element.removeAttribute(attribute);
      else element.setAttribute(attribute, value);
    });
  });
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  document.title = originalTitle;
  if (originalDescription) document.querySelector('meta[name="description"]').content = originalDescription;
  languageToggle.textContent = 'العربية';
  languageToggle.setAttribute('aria-label', 'Switch to Arabic');
}

function updateScaleContent(option = document.querySelector('.scale-option.is-active')) {
  const [copy, care, operations, finance] = scaleDetails[activeLanguage][option.dataset.scale];
  scaleCopy.textContent = copy;
  scaleCare.textContent = care;
  scaleOperations.textContent = operations;
  scaleFinance.textContent = finance;
}

function applyArabic() {
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
  document.title = 'صحة ون | إدارة الرعاية الصحية بالذكاء الاصطناعي للمملكة';
  document.querySelector('meta[name="description"]').content = 'صحة ون هو نظام لإدارة الرعاية الصحية بالذكاء الاصطناعي لمقدمي الرعاية في المملكة، مصمم لمسارات عمل سريرية وتشغيلية وامتثالية مترابطة.';
  languageToggle.textContent = 'English';
  languageToggle.setAttribute('aria-label', 'التبديل إلى اللغة الإنجليزية');

  setContent('.skip-link', 'انتقل إلى المحتوى');
  setAttribute('.brand', 'aria-label', 'الصفحة الرئيسية لصحة ون');
  setAttribute('.desktop-nav', 'aria-label', 'التنقل الرئيسي');
  setAttribute('.mobile-nav', 'aria-label', 'التنقل على الجوال');
  setContent('.nav-toggle .visually-hidden', 'فتح القائمة');
  setContent('.desktop-nav a', ['المنصة', 'الذكاء التشغيلي', 'سير العمل', 'الجاهزية للمملكة', 'التنفيذ']);
  setContent('.mobile-nav a', ['المنصة', 'الذكاء التشغيلي', 'سير العمل', 'الجاهزية للمملكة', 'التنفيذ', 'احجز جلسة استكشافية']);
  setContent('.button-quiet', 'احجز جلسة استكشافية');

  setContent('.hero .eyebrow', '<span></span> مصمم لعمليات الرعاية الصحية في المملكة', true);
  setContent('#hero-title', 'نظام إدارة الرعاية الصحية <em>بالذكاء الاصطناعي، يعمل بتناغم.</em>', true);
  setContent('.hero-lead', 'وحّد الفرق السريرية والتشغيلية والمالية والإدارية في مساحة عمل محكومة، من التسجيل وتقديم الرعاية إلى الفوترة والمتابعة.');
  setContent('.hero-actions .button-primary', 'احجز جلسة استكشافية <b aria-hidden="true">→</b>', true);
  setContent('.hero-actions .text-link', 'استكشف المنصة <b aria-hidden="true">↓</b>', true);
  setContent('.hero-proof dt', ['مسارات عمل مترابطة', 'تخطيط جاهز للمملكة', 'خيارات النشر']);
  setContent('.hero-proof dd', ['سياق سريري وتشغيلي ومالي موحّد', 'نطاق نفيس وفاتورة زاتكا', 'سحابي أو سحابة خاصة أو داخل المنشأة']);

  setContent('.product-topbar > span', 'مركز النور الطبي');
  setContent('.product-topbar small', 'عمليات مباشرة');
  setContent('.product-heading small', 'الاثنين · 24 أغسطس');
  setContent('.product-heading strong', 'صباح الخير، فاطمة الحربي');
  setContent('.metric-row small', ['زيارات اليوم', 'الانتظار الآن', 'إشغال الأسرّة']);
  setContent('.metric-row article:nth-child(1) span', '12% مقارنةً بالأمس');
  setContent('.metric-row article:nth-child(2) span', '6 بحاجة إلى فرز');
  setContent('.queue-preview header b', 'قائمة المرضى المباشرة');
  setContent('.queue-preview header span', 'عرض الكل');
  setContent('.queue-preview p b', ['فاطمة القحطاني', 'محمد الحربي', 'نورة العتيبي']);
  setContent('.queue-preview p small', ['طب عام · رقم 18', 'قلب · رقم 19', 'طوارئ · رقم 20']);
  setContent('.queue-preview em', ['مع الممرضة', 'بانتظار الخدمة', 'أولوية']);
  setContent('.activity-preview header b', 'نشاط الرعاية');
  setContent('.activity-preview header span', 'مباشر');
  setContent('.activity-preview p b', ['استلام نتيجة المختبر', 'تخصيص السرير 2B', 'تسوية الفاتورة']);
  setContent('.activity-preview p small', ['منذ 3 دقائق', 'منذ 12 دقيقة', 'منذ 28 دقيقة']);
  setContent('.floating-stat span', 'اكتمال الرعاية<br /><strong>يسير كما هو مخطط اليوم</strong>', true);
  setContent('.floating-appointment span', 'الموعد التالي<br /><b>10:30 · د. أ. خان</b>', true);

  setContent('.outcome-strip span', 'مصمم للفرق التي تقود');
  setContent('.outcome-strip strong', ['المستشفيات', 'العيادات', 'شبكات الرعاية', 'برامج الصحة العامة']);
  setAttribute('.outcome-strip', 'aria-label', 'مصمم لمنظمات الرعاية الصحية');
  setContent('.section-label > span', ['فجوات التشغيل التي تستحق المعالجة', 'مصمم لحجم عملياتك', 'منصة واحدة مترابطة', 'ذكاء تشغيلي مطبّق', 'مسارات عمل بانسيابية', 'المنتج في الممارسة', 'الجاهزية للمملكة', 'طريق عملي للتشغيل', 'دليل قبل التوسّع', 'الأسئلة الشائعة']);

  setContent('.challenges .split-heading h2', 'عندما تتجزأ الأنظمة، <em>تتأثر الرعاية أولاً.</em>', true);
  setContent('.challenges .split-heading p', 'تستبدل صحة ون التسليمات الورقية والأدوات المنفصلة بصورة تشغيلية مشتركة، لتتمكن الفرق من اتخاذ القرار التالي بالسياق الحالي.');
  setContent('.challenge-grid h3', ['السجلات موزعة بين الأنظمة', 'تدفق المرضى غير واضح', 'العمليات تفتقد للرؤية المباشرة']);
  setContent('.challenge-grid p', ['تؤدي المعلومات المتفرقة إلى تباطؤ القرارات وتكرار العمل وترك الفرق دون سياق موحّد.', 'تصبح قوائم الانتظار والتسليمات أصعب في الإدارة عندما لا ترى الفرق الأمامية ما يحدث الآن.', 'تصل السعة والمخزون والفوترة وأداء الخدمات متأخرة عن الوقت اللازم لدعم قرارات اليوم.']);

  setContent('.scale-picker .scale-option', ['منشأة واحدة', 'شبكة متعددة المنشآت', 'برنامج للصحة العامة']);
  setAttribute('.scale-picker', 'aria-label', 'اختر حجم عملياتك');
  setContent('.scale-snapshot > p', 'ما الذي تربطه صحة ون في هذا الحجم');
  setContent('.scale-snapshot span', ['تقديم الرعاية', 'العمليات', 'الضبط المالي']);

  setContent('#platform-title', 'تنسيق أقل. <em>رعاية أكثر ترابطاً.</em>', true);
  setContent('#platform .split-heading p', 'هيّئ المنشآت والأدوار ومسارات العمل والتكاملات وفق طريقة عمل فرقك، من دون فصل تقديم الرعاية عن العمليات التي تدعمها.');
  setContent('.feature-card h3', ['رحلة مريض مترابطة', 'اعرف ما يحدث الآن', 'شغّل المكتب الخلفي بالسياق', 'تكيّف مع نموذج تشغيلك']);
  setContent('.feature-card > p', ['يبقى التسجيل والمواعيد واللقاءات والطلبات والمتابعة مترابطاً حول المريض.', 'امنح الفرق رؤية مشتركة لقوائم الانتظار والسعة وتوفر الأسرّة ونشاط الرعاية الجاري.', 'نسّق المخزون والفوترة والجدولة وعمليات المنشأة إلى جانب حدث الرعاية.', 'هيّئ المواقع والصلاحيات والنماذج والتكاملات حول الخدمات التي تقدمها.']);
  setContent('.feature-card > small', 'سجّل · استشر · افحص · عالج · تابع');
  setContent('.capacity-visual header span', 'سعة الجناح');
  setContent('.capacity-visual small', '<b></b> مشغول <b></b> متاح', true);
  setContent('.feature-card.amber dt', ['المخزون', 'الفواتير', 'المناوبات']);
  setContent('.feature-card.amber dd', ['92% متوفر', '12 معلقة', '6 اليوم']);
  setContent('.feature-card.lilac dt', ['المنشآت', 'الأدوار والصلاحيات', 'التكاملات']);
  setContent('.feature-card.lilac dd', ['4 مهيأة', '12 نشطة', '3 متصلة']);

  setContent('#intelligence-title', 'يجب أن يجعل الذكاء الاصطناعي الخطوة التالية <em>أوضح، لا أكثر ضجيجاً.</em>', true);
  setContent('.intelligence-layout > div > p', 'صُممت صحة ون لإبراز الإشارات التشغيلية التي تحتاجها الفرق، مع إبقاء القرارات السريرية والتشغيلية تحت مسؤولية بشرية واضحة.');
  setContent('.light-link', 'ناقش أولويات مسار عملك المدعوم بالذكاء الاصطناعي <b aria-hidden="true">→</b>', true);
  setContent('.intelligence-cards h3', ['لخّص اليوم', 'أظهر ما يحتاج إلى اهتمام', 'نسّق الخطوة التالية']);
  setContent('.intelligence-cards p', ['اجمع قوائم الانتظار والسعة والاستثناءات التشغيلية في رؤية إدارية واضحة.', 'ساعد الفرق على تحديد المهام غير المحلولة وقيود التدفق وفجوات التسليم للمراجعة.', 'امنح كل دور السياق اللازم لدفع مسار المريض أو سير العمل التشغيلي إلى الأمام.']);

  setContent('#workflow-title', 'من الوصول إلى النتيجة، <em>لكل تسليم مكانه.</em>', true);
  setContent('#workflows .split-heading p', 'ابدأ بخط خدمة واحد واجعل مسار العمل الأعلى قيمة مرئياً وقابلاً للقياس وجاهزاً للتحسين قبل التوسع.');
  setContent('.workflow-rail h3', ['الوصول', 'الرعاية', 'التنسيق', 'إغلاق الحلقة']);
  setContent('.workflow-rail p', ['سجّل المرضى ووجّههم إلى الخدمة المناسبة.', 'وثّق اللقاءات والملاحظات وخطط الرعاية.', 'اطلب الفحوصات وأدر الأسرّة ونسّق الفرق.', 'أدر الفوترة والخروج والصرف والمتابعة.']);

  setContent('#proof-title', 'مصمم لوتيرة <em>يوم سريري حقيقي.</em>', true);
  setContent('.product-proof .split-heading p', 'هذه معاينات تمثيلية لمسارات عمل خيالية. يهيّأ النشر النهائي حول خطوط الخدمة والمستخدمين والمواقع والسياسات المعتمدة.');
  setAttribute('.screen-grid', 'aria-label', 'معاينات توضيحية لمسارات عمل المنتج');
  setContent('.screen-grid > article > div > span', ['سجل المريض', 'قائمة انتظار مباشرة', 'الفوترة والمخزون']);
  setContent('.screen-grid > article > div > h3', ['كل ما يهم، في السياق.', 'اجعل الانتظار مرئياً.', 'وضوح تشغيلي، دون ازدحام.']);
  setContent('.screen-grid > article > div > p', ['اللقاء الحالي والتاريخ والملاحظات والأدوية والمهام في مكان واحد.', 'ساعد موظفي الواجهة على الفرز والتنظيم والتصرف من دون أثر ورقي.', 'اربط بنود الرسوم والفواتير ومسارات المخزون بحدث الرعاية.']);
  setContent('.record-screen section header b', 'ملف المريض');
  setContent('.patient-row p', '<b>فاطمة القحطاني</b><small>أنثى · 32 سنة · رقم الملف 01982</small>', true);
  setContent('.patient-row em', 'لقاء نشط');
  setContent('.record-screen section nav', 'نظرة عامة <span>الخط الزمني</span><span>الطلبات</span><span>الملفات</span>', true);
  setContent('.record-data p:nth-child(1) small', 'المؤشرات الحيوية');
  setContent('.record-data p:nth-child(2)', '<small>ملاحظة سريرية</small><b>مراجعة خلال 7 أيام</b><span>استمر بالخطة الحالية.</span>', true);
  setContent('.queue-screen section header b', 'قائمة العيادات الخارجية');
  setContent('.queue-screen section header em', '24 بانتظار الخدمة');
  setContent('.queue-screen section nav', 'الكل <span>بانتظار الخدمة</span><span>تحت الرعاية</span>', true);
  setContent('.queue-screen section > p b', ['ريم الدوسري<small>طب عام</small>', 'عمر المطيري<small>قلب</small>', 'مها الزهراني<small>طب عام</small>'], true);
  setContent('.billing-screen section header span', 'فاتورة #INV-2481');
  setContent('.billing-screen section header b', 'مدفوعة');
  setContent('.billing-person span', 'نورة العتيبي<small>لقاء الطوارئ</small>', true);
  setContent('.billing-screen section > p:not(.billing-person)', ['استشارة <b>169.00 ر.س</b>', 'باقة مختبر <b>68.00 ر.س</b>'], true);
  setContent('.billing-screen section footer', 'الإجمالي <b>237.00 ر.س</b>', true);

  setContent('#compliance-title', 'ابنِ متطلبات المملكة <em>من أول مسار عمل.</em>', true);
  setContent('.compliance-heading p', 'نرسم تبادل معلومات التأمين الصحي والفوترة والتكامل والنشر وضوابط التشغيل المرتبطة بمنظمتك قبل تحديد نطاق التنفيذ.');
  setContent('.compliance-heading .light-link', 'ناقش متطلباتك <b aria-hidden="true">→</b>', true);
  setContent('.compliance-grid h3', ['تبادل الصحة والتأمين', 'متطلبات الفوترة الإلكترونية السعودية', 'تخطيط تكامل المرحلة الثانية', 'ضوابط النشر والتشغيل']);
  setContent('.compliance-grid p', ['قيّم مسارات الأهلية والموافقات المسبقة والمطالبات وتبادل المعلومات الصحية المنطبقة.', 'اربط بيانات الفاتورة وقواعد العمل ومتطلبات الحل الإلكتروني ذات الصلة بتصميم الفوترة.', 'جهّز نهج الانضمام وواجهة البرمجة لموجة تطبيق زاتكا المنطبقة على منظمتك.', 'حدّد مسؤوليات الوصول والتدقيق والتعامل مع البيانات والدعم والضمان قبل التشغيل.']);
  setContent('.compliance-grid a', ['المرجع الرسمي <b aria-hidden="true">↗</b>', 'المرجع الرسمي <b aria-hidden="true">↗</b>', 'المرجع الرسمي <b aria-hidden="true">↗</b>'], true);
  setContent('.compliance-note', '<b>مهم</b> تعتمد جاهزية التكامل والامتثال على الجهة والنطاق والسياسات والنشر وموجة التطبيق وإجراءات التشغيل. تدعم صحة ون التخطيط، ولا تدّعي اعتماداً أو موافقة تنظيمية دون تقييم رسمي.', true);

  setContent('#implementation-title', 'ابدأ بتركيز. <em>وتوسّع بثقة.</em>', true);
  setContent('#implementation .split-heading p', 'ابنِ الدليل في مسار عمل مضبوط قبل التوسع عبر المنشآت والخدمات والتكاملات.');
  setContent('.implementation-grid h3', ['الاكتشاف', 'التهيئة', 'التحقق', 'التوسع']);
  setContent('.implementation-grid p', ['ارسم الرعاية والعمليات والامتثال ومقاييس النجاح.', 'اضبط المواقع والأدوار والنماذج ومسارات العمل والتكاملات.', 'درّب الفرق وأكد مسار العمل الأعلى قيمة.', 'توسع مع الحوكمة والدعم والرؤية.']);

  setContent('.pilot-layout h2', 'ابنِ تجربتك حول <em>ما يهم فعلاً.</em>', true);
  setContent('.pilot-layout > div > p', 'لا نخترع نتائج. بدلاً من ذلك، نحدّد إشارات التشغيل وتدفق المرضى والتبني الجديرة بالتحقق قبل الإطلاق.');
  setContent('.pilot-points h3', ['اتفق على خط الأساس', 'تحقق أثناء الاستخدام', 'قرّر بالدليل']);
  setContent('.pilot-points p', ['حدّد مسار العمل الحالي وإشاراته وقيوده.', 'اختبر خط خدمة أو منشأة مضبوطة مع فرق حقيقية.', 'استخدم النتائج المعتمدة لتخطيط المرحلة التالية.']);

  setContent('#faq-title', 'أسئلة تستحق الطرح <em>قبل اختيار نظام إدارة صحية.</em>', true);
  setContent('.faq-layout > div > p', 'كل عملية نشر مختلفة. هذه هي الأسئلة العملية التي تشكل محادثة أولى مفيدة.');
  setContent('.faq-list summary', ['هل يمكن تهيئة صحة ون لمستشفانا أو عيادتنا؟<i aria-hidden="true">+</i>', 'هل يدعم تخطيط نفيس وفاتورة زاتكا؟<i aria-hidden="true">+</i>', 'هل يدعم منشآت متعددة؟<i aria-hidden="true">+</i>', 'ماذا يحدث بعد جلسة الاستكشاف؟<i aria-hidden="true">+</i>'], true);
  setContent('.faq-list details p', ['نعم. ترسم مرحلة الاكتشاف منشآتك وأدوارك وخطوط خدماتك ونماذجك ومسارات عملك ومتطلبات التكامل قبل بدء التهيئة.', 'نقيّم نطاق التكامل والتشغيل ذي الصلة مع مختصيك. لا يحقق البرنامج وحده امتثالاً أو موافقة تنظيمية.', 'يمكن تهيئة نماذج المنظمة والمنشأة والموقع لبيئات متعددة المنشآت وخطط إطلاق محكومة.', 'نتفق على مسار عمل مركز ونطاق تنفيذ وأصحاب مصلحة والدليل المطلوب للتحقق من تجربة أولية.']);

  setContent('.contact-layout .eyebrow', '<span></span> محادثة أولى عملية', true);
  setContent('#contact-title', 'احجز جلسة <em>استكشافية للمملكة.</em>', true);
  setContent('.contact-layout > div > p:not(.eyebrow)', 'أخبرنا عن نموذج الرعاية وأولوية مسار العمل وبيئة التشغيل لديك. سنساعدك في تحديد خطوة عملية تالية.');
  setContent('.contact-layout li', ['نركّز على مسار العمل الأعلى قيمة لديك', 'نوضح أسئلة التكامل والنشر', 'نصمم تجربة أولية قائمة على الدليل']);
  setContent('.contact-form label:not(.consent)', ['البريد الإلكتروني للعمل', 'المنظمة', 'الأولوية الرئيسية']);
  setAttribute('#email', 'placeholder', 'you@organisation.sa');
  setAttribute('#organisation', 'placeholder', 'مستشفى أو عيادة أو شبكة');
  setContent('#interest option', ['تدفق المرضى والتسجيل', 'التوثيق السريري', 'العمليات والسعة', 'الفوترة والاستعداد لزاتكا', 'تخطيط تكامل نفيس', 'تحول متعدد المنشآت']);
  setContent('.contact-form .consent span', 'أوافق على التواصل معي بشأن هذا الطلب وأفهم أنه لا ينبغي إدخال أي معلومات عن المرضى.');
  setContent('.contact-form button', 'اطلب جلسة استكشافية <b aria-hidden="true">→</b>', true);
  setAttribute('.footer-logo', 'aria-label', 'الصفحة الرئيسية لصحة ون');
  setContent('.footer-layout > p', 'إدارة الرعاية الصحية بالذكاء الاصطناعي، مخططة وفق واقع تقديم الرعاية في المملكة.');
  setAttribute('.footer-layout nav', 'aria-label', 'تنقل التذييل');
  setContent('.footer-layout nav a', ['المنصة', 'الجاهزية للمملكة', 'تواصل معنا', 'العودة للأعلى ↑']);
}

function setLanguage(language) {
  activeLanguage = language;
  if (language === 'ar') applyArabic();
  else restoreEnglish();
  updateScaleContent();
}

languageToggle.addEventListener('click', () => {
  setLanguage(activeLanguage === 'ar' ? 'en' : 'ar');
});

function closeMobileNav() {
  mobileNav.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) mobileNav.querySelector('a')?.focus();
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMobileNav();
    navToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeMobileNav();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileNav();
});

scaleOptions.forEach((option) => {
  option.addEventListener('click', () => {
    scaleOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    updateScaleContent(option);
  });
});

function initialiseRevealMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealItems = document.querySelectorAll('.reveal');
  document.documentElement.classList.add('motion-ready');
  revealItems.forEach((item) => item.classList.add('will-reveal'));

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px' });

  revealItems.forEach((item) => observer.observe(item));
}

function initialiseActiveNavigation() {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    navLinks.forEach((link) => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`);
    });
  }, { rootMargin: '-32% 0px -58%', threshold: [0, 0.1, 0.3] });

  sections.forEach((section) => observer.observe(section));
}

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('is-error', isError);
  formMessage.classList.add('is-visible');
}

async function submitToEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
}

function openMailFallback(data) {
  const subject = encodeURIComponent(`KSA discovery session request — ${data.organisation}`);
  const body = encodeURIComponent(
    `Work email: ${data.email}\nOrganisation: ${data.organisation}\nPrimary priority: ${data.interest}`,
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const submitButton = form.querySelector('button[type="submit"]');

  if (!FORM_ENDPOINT) {
    if (CONTACT_EMAIL) {
      openMailFallback(data);
      showFormMessage(activeLanguage === 'ar' ? 'جارٍ فتح تطبيق البريد الإلكتروني مع طلبك المعبأ.' : 'Opening your email client with your discovery request.');
      return;
    }

    showFormMessage(activeLanguage === 'ar' ? 'لم يتم إعداد تكامل الحجز بعد. يرجى ربط أداة إدارة علاقات عملاء أو حجز أو نقطة تواصل معتمدة قبل النشر.' : 'Booking integration is not configured yet. Please connect an approved CRM, booking tool, or contact endpoint before publishing.', true);
    return;
  }

  submitButton.disabled = true;
  try {
    await submitToEndpoint(data);
    form.reset();
    showFormMessage(activeLanguage === 'ar' ? 'شكرًا لك. سيتواصل معك أحد أعضاء فريق صحة ون قريبًا.' : 'Thank you. A member of the Seha One team will follow up shortly.');
  } catch {
    showFormMessage(activeLanguage === 'ar' ? 'تعذر إرسال طلبك. يرجى استخدام قناة التواصل المعتمدة أو المحاولة مجددًا بعد قليل.' : 'We could not send your request. Please use the approved contact channel or try again shortly.', true);
  } finally {
    submitButton.disabled = false;
  }
});

setLanguage('ar');
initialiseRevealMotion();
initialiseActiveNavigation();
