import * as tf from '@tensorflow/tfjs';
let model = tf.loadLayersModel('model/model.json');

const url = 'https://api.npoint.io/6fa50cbaa66572bd0a81'

let req = new XMLHttpRequest();
req.open("GET", url, false);
req.send(null);
let wordtoindex = JSON.parse(req.responseText);

//Credit: https://github.com/tensorflow/tfjs-examples
function padSequences(
sequences) {
return sequences.map(seq => {
  // Perform padding.
  if (seq.length < 100) {
    const pad = [];
    for (let i = 0; i < 100 - seq.length; ++i) {
      pad.push(0);
    }
    seq = pad.concat(seq);
  }

  return seq;
});
}

function predict(text) {
  let emojisplit = new EmojiSplit().create();
  // Convert to lower case and remove all punctuations.
  let rawText =
      text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '');
  rawText = emojisplit.splitBySymbol(rawText);
  rawText = rawText.filter(v=>v.trim()!='');
  console.log(rawText);
  let inputText = []
  for (let i = 0; i < rawText.length; i++) {
    let text = rawText[i].split(' ');
    text = text.filter(v=>v.trim()!='');
    for (let j = 0; j < text.length; j++) {
        inputText.push(text[j]);
    }
  }
  // Convert the words to a sequence of word indices.
  const sequence = inputText.map(word => {
    if (wordtoindex[word] != null) {
      let wordIndex = wordtoindex[word];
      return wordIndex
    }
    else {
      let wordIndex = 0;
      return wordIndex
    }
  });
  // Perform truncation and padding.
  const paddedSequence = padSequences([sequence]);
  const input = tf.tensor(paddedSequence, [100]);

  const prediction = model.predict(input);
  
  return prediction;
}

$(function() {
    // Initializes and creates emoji set from sprite sheet
    window.emojiPicker = new EmojiPicker({
      emojiable_selector: '[data-emojiable=true]',
      assetsPath: 'http://onesignal.github.io/emoji-picker/lib/img/',
      popupButtonClasses: 'fa fa-smile-o'
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    window.emojiPicker.discover();
  });

  document.querySelector('#button')
      .addEventListener('click', (e) => {
        const text = document.querySelector('#textbox').value;
        console.log(predict(text));
      });