## **依赖项 npm:axios:0.18.0 vulnerable**

升级到 1.7.8

CVE-2019-10742，分数: 7.5

Axios up to and including 0.18.0 allows attackers to cause a denial of service (application crash) by continuing to accepting content after maxContentLength is exceeded.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2019-10742?utm_source=JetBrains

CVE-2021-3749，分数: 7.5

axios is vulnerable to Inefficient Regular Expression Complexity

阅读更多: https://www.mend.io/vulnerability-database/CVE-2021-3749?utm_source=JetBrains

WS-2023-0439，分数: 7.5

Axios is vulnerable to Regular Expression Denial of Service (ReDoS). When a manipulated string is provided as input to the format method, the regular expression exhibits a time complexity of O(n^2). Server becomes unable to provide normal service due to the excessive cost and time wasted in processing vulnerable regular expressions.

阅读更多: https://www.mend.io/vulnerability-database/WS-2023-0439?utm_source=JetBrains

CVE-2023-45857，分数: 6.5

An issue discovered in Axios 1.5.1 inadvertently reveals the confidential XSRF-TOKEN stored in cookies by including it in the HTTP header X-XSRF-TOKEN for every request made to any host allowing attackers to view sensitive information.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2023-45857?utm_source=JetBrains

CVE-2020-28168，分数: 5.9

Axios NPM package 0.21.0 contains a Server-Side Request Forgery (SSRF) vulnerability where an attacker is able to bypass a proxy by providing a URL that responds with a redirect to a restricted host or IP address.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2020-28168?utm_source=JetBrains

CVE-2024-57965，分数: 0

In axios before 1.7.8, lib/helpers/isURLSameOrigin.js does not use a URL object when determining an origin, and has a potentially unwanted setAttribute('href',href) call. NOTE: some parties feel that the code change only addresses a warning message from a SAST tool and does not fix a vulnerability.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2024-57965?utm_source=JetBrains

---
## **依赖项 npm:shelljs:0.7.8 vulnerable**

升级到 0.8.5

CVE-2022-0144，分数: 7.1

shelljs is vulnerable to Improper Privilege Management

阅读更多: https://www.mend.io/vulnerability-database/CVE-2022-0144?utm_source=JetBrains

---

## **依赖项 npm:vue-template-compiler:2.7.16 vulnerable**

CVE-2024-6783，分数: 4.8

A vulnerability has been discovered in Vue, that allows an attacker to perform XSS via prototype pollution. The attacker could change the prototype chain of some properties such as `Object.prototype.staticClass` or `Object.prototype.staticStyle` to execute arbitrary JavaScript code.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2024-6783?utm_source=JetBrains

---

## **依赖项 npm:webpack:3.12.0 vulnerable**

升级到 5.94.0

CVE-2024-43788，分数: 6.4

Webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset. The webpack developers have discovered a DOM Clobbering vulnerability in Webpack’s `AutoPublicPathRuntimeModule`. The DOM Clobbering gadget in the module can lead to cross-site scripting (XSS) in web pages where scriptless attacker-controlled HTML elements (e.g., an `img` tag with an unsanitized `name` attribute) are present. Real-world exploitation of this gadget has been observed in the Canvas LMS which allows a XSS attack to happen through a javascript code compiled by Webpack (the vulnerable part is from Webpack). DOM Clobbering is a type of code-reuse attack where the attacker first embeds a piece of non-script, seemingly benign HTML markups in the webpage (e.g. through a post or comment) and leverages the gadgets (pieces of js code) living in the existing javascript code to transform it into executable code. This vulnerability can lead to cross-site scripting (XSS) on websites that include Webpack-generated files and allow users to inject certain scriptless HTML tags with improperly sanitized name or id attributes. This issue has been addressed in release version 5.94.0. All users are advised to upgrade. There are no known workarounds for this issue.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2024-43788?utm_source=JetBrains

---

## **依赖项 npm:webpack-bundle-analyzer:2.13.1 vulnerable**

升级到 3.3.2

WS-2019-0058，分数: 6.3

Versions of webpack-bundle-analyzer prior to 3.3.2 are vulnerable to Cross-Site Scripting. The package uses JSON.stringify() without properly escaping input which may lead to Cross-Site Scripting.

阅读更多: https://www.mend.io/vulnerability-database/WS-2019-0058?utm_source=JetBrains

---

## **依赖项 npm:webpack-dev-server:2.11.5 vulnerable**

升级到 3.1.11

CVE-2018-14732，分数: 7.5

An issue was discovered in lib/Server.js in webpack-dev-server before 3.1.6. Attackers are able to steal developer's code because the origin of requests is not checked by the WebSocket server, which is used for HMR (Hot Module Replacement). Anyone can receive the HMR message sent by the WebSocket server via a ws://127.0.0.1:8080/ connection from any origin.

阅读更多: https://www.mend.io/vulnerability-database/CVE-2018-14732?utm_source=JetBrains

