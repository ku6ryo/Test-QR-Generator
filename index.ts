import QRCode, { QRCodeErrorCorrectionLevel, QRCodeSegment } from "qrcode"
import toSJIS from "qrcode/helper/to-sjis"

enum CorrectionLevel {
  L = "L",
  M = "M",
  Q = "Q",
  H = "H",
}

enum EncodingMode {
  ALPHANUMERIC = "alphanumeric",
  NUMERIC = "numeric",
  BYTE = "byte",
  KANJI = "kanji",
}

type TestData = {
  title: string,
  segments: QRCodeSegment[]
}

const testData: TestData[] = [{
  title: "number only / alphanumeric",
  segments: [
    { data: "123456", mode: EncodingMode.ALPHANUMERIC },
  ],
}, {
  title: "number only / numeric",
  segments: [
    { data: "123456", mode: EncodingMode.NUMERIC },
  ],
}, {
  title: "number only / byte",
  segments: [
    { data: "123456", mode: EncodingMode.BYTE },
  ],
}, {
  title: "alphabets only / alphanumeric",
  segments: [
    { data: "ENGLISH", mode: EncodingMode.ALPHANUMERIC },
  ],
}, {
  title: "alphabets only / byte",
  segments: [
    { data: "english", mode: EncodingMode.BYTE },
  ],
}, {
  title: "漢字 only / byte",
  segments: [
    { data: "漢字", mode: EncodingMode.BYTE },
  ],
}, {
  title: "漢字 only / SJIS",
  segments: [
    { data: "漢字", mode: EncodingMode.KANJI },
  ],
}, {
  title: "カタカナ only / byte",
  segments: [
    { data: "カタカナ", mode: EncodingMode.BYTE },
  ],
}, {
  title: "カタカナ only / SJIS",
  segments: [
    { data: "カタカナ", mode: EncodingMode.KANJI },
  ],
}, {
  title: "半角カタカナ only / byte",
  segments: [
    { data: "ｶﾀｶﾅ", mode: EncodingMode.BYTE },
  ],
}, {
  title: "backspace only / byte",
  segments: [
    { data: "\b", mode: EncodingMode.BYTE },
  ],
}, {
  title: "U+0000 only / byte",
  segments: [
    { data: "\u0000", mode: EncodingMode.BYTE },
  ],
}, {
  title: "UTF-8 emoji only / byte",
  segments: [
    { data: "\u263a", mode: EncodingMode.BYTE },
  ],
}, {
  title: "URL / byte",
  segments: [
    { data: "https://google.com", mode: EncodingMode.BYTE },
  ],
}, {
  title: "URL / byte + 日本語 title / byte",
  segments: [
    { data: "グーグル", mode: EncodingMode.BYTE },
    { data: "https://google.com", mode: EncodingMode.BYTE },
  ],
}, {
  title: "URL / byte + 日本語 title / SJIS",
  segments: [
    { data: "グーグル", mode: EncodingMode.KANJI },
    { data: "https://google.com", mode: EncodingMode.BYTE },
  ],
}, {
  title: "mailto: / byte",
  segments: [
    { data: "mailto:test@example.com", mode: EncodingMode.BYTE },
  ],
}, {
  title: "タイ語 / byte",
  segments: [
    { data: "สุขสันต์วันคริสต์มาส", mode: EncodingMode.BYTE },
  ],
}]

async function generate (
  filePath: string,
  segments: QRCodeSegment[],
  level: QRCodeErrorCorrectionLevel,
) {
  await QRCode.toFile(
    filePath,
    segments,
    {
      toSJISFunc: toSJIS,
      errorCorrectionLevel: level,
    }
  )
}

testData.forEach((data, i) => {
  Object.values(CorrectionLevel).forEach(async (level) => {
    const filename = (() => {
      const tmp = "000" + i
      return tmp.substr(tmp.length - 4, 4) + "-" + level
    })()
    const filePath = "./outputs/" + filename + ".png"
    let hasError = false
    try {
      await generate(filePath, data.segments, level)
    } catch (e) {
      hasError = true
      console.error(e)
    }
    if (hasError) {
      console.log("error")
    }
    console.log(`${filename},${level},${data.title}`)
    i += 1;
  })
})
