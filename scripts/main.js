var textPredictor = textPredictor || null;

$(document).ready(() => {
    $('#maxWordsInput').val(textPredictor.defaultMaxWords);
    $('#topPInput').val(textPredictor.defaultTopP);

    $('#exampleText').keyup(delay(function (e) {
        textPredictor.predictText();
    }, 500));

    $('#copyText').click(function () {
        textPredictor.copyTextToInput();
        textPredictor.predictText();
    })
})

function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

textPredictor = {
    url: "https://proposals-nlp-functions.azurewebsites.net/api/CallGenerateOverHttp?code=RAMbr1oYNhalvjQTk0T53LJBp9Uls8pzkh%2F4czlqzKIwYvbaNdzjgg%3D%3D",
    defaultMaxWords: 10,
    defaultTopP: 0.6,
    predictText: () => {
        let data = textPredictor.prepareData();
        if (data.text == '') {
            textPredictor.setOutputText('');
        } else {
            $.ajax(
                {
                    data: JSON.stringify(data),
                    url: textPredictor.url,
                    contentType: "application/json",
                    dataType: "json",
                    type: "POST",
                    success: textPredictor.success,
                    error: textPredictor.error
                }
            );
        }
    },
    success: (data) => {
        console.log(data);
        if (data) {
            textPredictor.setOutputText(data.full_sentence);
        }

    },
    setOutputText: (text) => {
        $('#outputText').text(text);
    },
    error: (xhr, status, error) => {
        console.log(error);
    },
    prepareData: () => {
        let data = {
            text: textPredictor.getText(),
            top_p: textPredictor.getTopP(),
            max_words: textPredictor.getMaxWords()
        }
        return data;
    },
    getText: () => {
        var text = $('#exampleText').val();
        if (text)
            text = text.trim()
        return text;
    },
    getMaxWords: () => {
        var text = $('#maxWordsInput').val();
        var number = parseInt(text);
        if (isNaN(number)) {
            return textPredictor.defaultMaxWords;
        }
        return number;
    },
    getTopP: () => {
        var text = $('#topPInput').val();
        var number = parseFloat(text);
        if (isNaN(number)) {
            return textPredictor.defaultTopP;
        }
        return number;
    },
    copyTextToInput: () => {
        let text = $('#outputText').text();
        $('#exampleText').val(text);
    }

}