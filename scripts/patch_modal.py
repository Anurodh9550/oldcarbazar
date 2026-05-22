import re

p = r"src/components/car-detail/CarDetailPage.tsx"
t = open(p, encoding="utf-8").read()
pat = r"\{showSeller && \(\s*<motion className=\"fixed inset-0.*?\)\}"
pat = r"\{showSeller && \(\s*<div\s*className=\"fixed inset-0.*?\n      \)\}"
rep = """{showSeller && (
        <SellerDetailsModal
          detail={detail}
          recommended={similar}
          whatsappHref={whatsappHref}
          onClose={() => setShowSeller(false)}
        />
      )}"""
t2, n = re.subn(pat, rep, t, count=1, flags=re.DOTALL)
print("replacements:", n)
open(p, "w", encoding="utf-8").write(t2)
