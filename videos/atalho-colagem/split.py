from PIL import Image
import numpy as np
from scipy import ndimage
names={1:{(137,60):'stethoscope',(242,1050):'hosp1',(243,562):'env_open',(859,27):'hosp2',(1002,1314):'note_r',(1074,1093):'note_l',(1141,503):'hosp3'},
2:{(118,40):'head',(220,590):'crumple',(231,1098):'sticky',(781,612):'receipt',(857,34):'clock_plain',(914,1002):'env_sealed'},
3:{(167,31):'clock_big',(292,607):'coin',(362,957):'car',(761,602):'form',(770,1219):'hourglass_h',(792,45):'chair_plastic'},
4:{(116,51):'scissors_a',(172,518):'stopwatch',(290,1016):'bubble_cream',(864,1022):'calculator',(1064,68):'glasses'},
5:{(20,968):'lamp',(112,355):'armchair',(648,640):'man',(685,149):'woman',(685,1142):'older'},
6:{(77,846):'bubble_cream2',(86,80):'bubble_green',(462,83):'bubble_grey',(468,867):'namecard',(813,254):'hourglass_e',(821,809):'planner'},
7:{(151,24):'photo_serum',(207,1000):'split_photo',(297,511):'star',(920,975):'repost',(934,126):'quote_bubble',(1156,960):'repost'},
8:{(60,963):'paper_stack',(222,52):'book',(757,126):'magnifier',(798,596):'scissors_b',(873,1270):'bookmark'}}
for i,m in names.items():
    c=np.array(Image.open(f'src/C{i}.jpg')).astype(float)
    a=np.array(Image.open(f'src/A{i}.png')).astype(float)
    lab,n=ndimage.label(a>40)
    big=ndimage.binary_dilation(lab>0,iterations=0) if False else None
    groups={}
    for k,sl in enumerate(ndimage.find_objects(lab),1):
        key=(sl[0].start,sl[1].start)
        if key in m: groups.setdefault(m[key],[]).append(k)
    for name,ks in groups.items():
        reg=np.isin(lab,ks)
        reg=ndimage.binary_dilation(reg,iterations=12)
        al=np.where(reg,a,0)
        af=al/255.0
        col=np.where(af[...,None]>0.02,(c-128*(1-af[...,None]))/np.maximum(af[...,None],0.02),c)
        col=np.clip(col,0,255)
        ys,xs=np.where(al>3)
        y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        out=np.dstack([col,al])[y0:y1,x0:x1].astype(np.uint8)
        Image.fromarray(out,'RGBA').save(f'pieces/{name}.png')
        print(name,out.shape)
