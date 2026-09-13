self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/project/(?<nxtPprojectNumber>[^/]+?)(?:/.*)?"
          }
        ],
        "source": "/project/:nxtPprojectNumber/line/:nxtPcostCode",
        "destination": "/project/:nxtPprojectNumber/(.)line/:nxtPcostCode"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()