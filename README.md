# Hotel Príncipe das Colinas — versão moderna

Versão estática, responsiva e compatível com GitHub Pages.

## Recursos

- Layout moderno e responsivo
- Carrossel horizontal de suítes
- Animações suaves ao rolar a página
- Efeito parallax em imagens
- Galeria de fotos
- Menu adaptado para celular
- Botão flutuante de WhatsApp
- Formulário de pré-reserva sem banco de dados
- Mensagem formatada para envio pelo WhatsApp

## Arquivos

- `index.html`
- `styles.css`
- `script.js`
- `README.md`
- `images/logo-hotel.jpg`

## Contato

WhatsApp e telefone do hotel: **(93) 98418-2845**.
O número internacional usado nos links é `5593984182845`.
Os botões de consulta abrem uma mensagem para revisão no WhatsApp; não enviam automaticamente nem confirmam reserva.

## Apresentação e navegação

- Marca completa em uma linha, com a imagem original sem recorte circular.
- Paleta verde, marfim e dourado; fotografias em destaque.
- Layout adaptado para computador, tablet e celular.
- Seletor por número de suíte, carrossel com setas e suporte a teclado.
- Menu compacto com controles acessíveis e botões adequados ao toque.
- Campos com fonte de 16 px para facilitar o uso no celular.

## Imagens

As fotos reais já estão organizadas no site. A pasta `fotos-otimizadas/` preserva as subpastas do acervo e contém 971 cópias WebP. Os originais não são utilizados nem alterados pelo site.

- Fachada na abertura, piscina na seção de destaque e sala de estar na pré-reserva.
- 22 suítes selecionadas em `fotos.js`, identificadas pelas pastas de origem.
- Galeria de 18 fotos com filtros: áreas externas, ambientes, lazer e suítes.
- Ampliação por clique ou teclado, navegação por setas e fechamento por Escape.
- Carregamento sob demanda das imagens fora da abertura.

Para mudar a seleção, edite `SUITES` e `GALLERY` em `fotos.js`. A identificação segue números visíveis nas fotos. A suíte 202 foi recuperada do conjunto que estava na pasta 201. Sete suítes com interiores misturados usam fotos internas de referência do hotel, identificadas como tal nos cartões e na ampliação. Consulte `REVISAO-FOTOS.md` para evidências e pendências. As pastas 211 e 213 continuam sem interior confirmado.

Mantenha `fotos.js` e `fotos-otimizadas/` junto aos demais arquivos ao hospedar o site.

## GitHub Pages

Envie todos os arquivos para a raiz do repositório e mantenha:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

Não há backend nem armazenamento de dados. O formulário apenas abre o WhatsApp com a mensagem pronta.

## Modelos de mensagem

`buildWhatsAppMessage` em `script.js` reúne as mensagens de contato, consulta de suíte e formulário. Os modelos usam texto simples: sem emojis, negrito ou itálico. Mantêm acentos e quebras de linha. Os scripts e estilos têm versão na URL do HTML para atualizar o cache ao recarregar.

## Localização, Instagram e avaliações

- Endereço: R. Cap. Pantoja, Almeirim, PA, CEP 68230-000.
- Instagram: https://www.instagram.com/principedascolinasoficial/ (vinculado pelo próprio perfil do hotel no Maps).
- Google Maps: https://www.google.com/maps?cid=12341129981086473559
- Avaliações consultadas em 27/09/2026: 5,0/5, 22 avaliações. A seção inclui três trechos curtos, autores e notas individuais. A nota é uma fotografia dessa consulta, não sincronização automática; manter a data visível e atualizar após conferir o perfil.
