import json
SCRIPT = """Precisar demais de alguém é sinal de borderline?
Começa pequeno. Você espera a resposta pra decidir o almoço. Depois, pra saber se o dia foi bom.
Cada vez que a pessoa responde, vem alívio. E o alívio ensina a procurar de novo.
Aos poucos, amigos, opinião própria e o que você gostava de fazer ficam sem uso. Sobra uma pessoa segurando tudo.
Isso costuma ser chamado de dependência emocional. Aparece com ou sem borderline.
A diferença aparece quando a pessoa ameaça ir embora.
Tem quem responda cedendo em tudo. Concorda, pede desculpa pelo que não fez e, se acaba, procura logo outro apoio.
O borderline costuma vir em ondas. Implora pra ficar, acusa, se arrepende. Quem era tudo vira ameaça em poucas horas.
E o sofrimento não fica só na relação. Aparecem vazio, impulso que machuca e dúvida sobre quem você é, mesmo quando ninguém foi embora.
As duas coisas podem existir juntas. Quem separa é uma avaliação com calma.""".split()
W = json.load(open('audio/whisper.json'))
assert W[132]['w'] == 'em'; W[131]['e'] = W[132]['e']; del W[132]
print(len(SCRIPT), len(W))
for i, (a, b) in enumerate(zip(SCRIPT, W)):
    if a.strip('.,?').lower() != b['w'].strip('.,?').lower():
        print(i, a, b['w'])
assert len(SCRIPT) == len(W)
json.dump([{'w': a, 's': b['s'], 'e': b['e']} for a, b in zip(SCRIPT, W)], open('audio/words.json', 'w'), ensure_ascii=False)
