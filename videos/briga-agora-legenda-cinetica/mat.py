import sys,os,numpy as np,onnxruntime as ort
from PIL import Image
s=ort.InferenceSession(sys.argv[1],providers=["CPUExecutionProvider"])
inn=s.get_inputs()[0].name
for f in sorted(os.listdir(sys.argv[2])):
  im=Image.open(os.path.join(sys.argv[2],f)).convert("RGB")
  x=np.asarray(im.resize((320,320),Image.LANCZOS),np.float32)/255.
  x=(x-[0.485,0.456,0.406])/[0.229,0.224,0.225]
  x=x.transpose(2,0,1)[None].astype(np.float32)
  m=s.run(None,{inn:x})[0][0,0]; m=(m-m.min())/(m.max()-m.min()+1e-8)
  Image.fromarray((m*255).astype(np.uint8)).resize((1080,1920),Image.LANCZOS).save(os.path.join(sys.argv[3],f))
