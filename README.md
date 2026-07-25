# 過緊張チェックタイマー / Tension Check Timer

## 日本語

### 概要
集中しすぎによる身体の緊張に気づき、定期的に力を抜くきっかけを作るための個人用タイマーです。

### カラーテーマ
- パウダースカイ（初期値）
- ミスティラベンダー
- セージグレージュ
- スモーキーローズ

### フォントクレジット
- Klee One
- 提供: Fontworks Inc.
- URL: https://fonts.google.com/specimen/Klee+One?subset=japanese

### サウンドクレジット
#### カフェの環境音
- 提供: PWLPL
- URL: https://pixabay.com/users/pwlpl-16464651/
- 使用ファイル: `sounds/pwlpl-busy-coffee-shop-ambiance-with-crowd-chatter-481151.mp3`

#### やさしい雨
- 提供: DRAGON-STUDIO
- URL: https://pixabay.com/users/dragon-studio-38165424/
- 使用ファイル: `sounds/dragon-studio-gentle-midday-rain-499668.mp3`

### 音声ファイルの配置
以下の2ファイルを、ファイル名を変更せず `sounds` フォルダに配置してください。

```text
sounds/
├── dragon-studio-gentle-midday-rain-499668.mp3
└── pwlpl-busy-coffee-shop-ambiance-with-crowd-chatter-481151.mp3
```

---

## English

### Overview
A personal timer designed to help notice physical tension caused by over-focusing and create regular opportunities to relax.

### Color Themes
- Powder Sky (default)
- Misty Lavender
- Sage Greige
- Smoky Rose

### Font Credit
- Klee One
- Provided by: Fontworks Inc.
- URL: https://fonts.google.com/specimen/Klee+One?subset=japanese

### Sound Credits
#### Café Ambience
- Provided by: PWLPL
- URL: https://pixabay.com/users/pwlpl-16464651/
- File used: `sounds/pwlpl-busy-coffee-shop-ambiance-with-crowd-chatter-481151.mp3`

#### Gentle Rain
- Provided by: DRAGON-STUDIO
- URL: https://pixabay.com/users/dragon-studio-38165424/
- File used: `sounds/dragon-studio-gentle-midday-rain-499668.mp3`

### Audio File Placement
Place the following two files inside the `sounds` folder without changing their filenames.

```text
sounds/
├── dragon-studio-gentle-midday-rain-499668.mp3
└── pwlpl-busy-coffee-shop-ambiance-with-crowd-chatter-481151.mp3
```


## 身体チェック記録とエクスポート

集中時間が終了するたびに、身体の具体的なサインを確認する質問がランダムで1問表示されます。回答はこの端末内の `localStorage` に保存され、設定画面からCSVまたはJSONでエクスポートできます。

「今回は記録しない」を選んだ場合は、回答データは保存されません。設定画面の「記録を削除」では、確認メッセージの後に端末内の全履歴を削除します。

### エクスポート項目

| 項目 | 説明 |
|---|---|
| `recordVersion` | 記録形式のバージョン。将来の形式変更を判別するための番号です。 |
| `answeredAt` | 回答日時。端末のタイムゾーンを含むISO 8601形式です。 |
| `questionId` | 質問を識別する固定IDです。表示文を変更しても同じ質問として集計できます。 |
| `question` | 回答時に画面へ表示された質問文です。 |
| `bodyArea` | 確認した身体部位・カテゴリーです。例：`shoulders`、`jaw`、`breathing`。 |
| `answerId` | 回答を識別する固定IDです。言語に依存せず集計できます。 |
| `answer` | 回答時に画面へ表示された回答文です。 |
| `soundId` | 回答前の集中時間に使用していたサウンドの固定IDです。 |
| `sound` | 回答前の集中時間に使用していたサウンドの表示名です。 |
| `focusDurationMinutes` | 設定されていた集中時間です。単位は分です。 |
| `actualFocusSeconds` | 完了した集中時間です。単位は秒です。 |
| `cycleNumber` | その回答が行われたセット番号です。 |
| `checkTiming` | 質問が表示されたタイミングです。現在は `focus_end`（集中終了時）です。 |
| `language` | 回答時の表示言語です。`ja` または `en` です。 |

CSVは表計算ソフトやChatGPTでの集計・分析に向いています。JSONはデータ構造を保ったバックアップに向いています。

---

## Body Check Records and Export

After each focus session, one randomly selected question asks about a specific physical sign. Answers are stored in this device's `localStorage` and can be exported as CSV or JSON from the settings screen.

Selecting “Do not record this time” does not save a response. The “Delete Records” button removes all locally stored history after a confirmation message.

### Export Fields

| Field | Description |
|---|---|
| `recordVersion` | Version number of the record format, used to identify future format changes. |
| `answeredAt` | Date and time of the answer in ISO 8601 format, including the device time-zone offset. |
| `questionId` | Stable ID identifying the question, allowing aggregation even if its displayed wording changes. |
| `question` | Question text displayed when the answer was recorded. |
| `bodyArea` | Body area or category checked, such as `shoulders`, `jaw`, or `breathing`. |
| `answerId` | Stable ID identifying the answer independently of display language. |
| `answer` | Answer text displayed when the response was recorded. |
| `soundId` | Stable ID of the focus sound used before the answer. |
| `sound` | Display name of the focus sound used before the answer. |
| `focusDurationMinutes` | Configured focus duration in minutes. |
| `actualFocusSeconds` | Completed focus duration in seconds. |
| `cycleNumber` | Session cycle number associated with the response. |
| `checkTiming` | Point at which the question was shown. Currently `focus_end`. |
| `language` | Display language at the time of the response: `ja` or `en`. |

CSV is suited to aggregation and analysis in spreadsheets or ChatGPT. JSON is suited to complete structured backups.
