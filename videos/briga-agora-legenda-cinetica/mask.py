import sys,os,numpy as np
from PIL import Image, ImageFilter
L=sys.argv[1]
os.makedirs(f"{L}/backm",exist_ok=True)
for f in sorted(os.listdir(f"{L}/mt/out")):
  b=f"{L}/ov/back/{f}"
  if not os.path.exists(b): continue
  im=np.asarray(Image.open(b).convert("RGBA")).astype(np.float32)
  m=Image.open(f"{L}/mt/out/{f}").filter(ImageFilter.GaussianBlur(1.5))
  m=np.asarray(m).astype(np.float32)/255.
  m=np.clip((m-0.35)/0.4,0,1)  # endurece a borda do cabelo
  im[...,3]*=(1-m)
  Image.fromarray(im.astype(np.uint8)).save(f"{L}/backm/{f}")
print("ok")
