const properties = PropertiesService.getScriptProperties()

//utility functions
function atob (str) {
  return Utilities.newBlob(Utilities.base64Decode(str)).getDataAsString()
}
function btoa (str) {
  return Utilities.base64Encode(str)
}

const ghData = {
  username: "thelegendski",
  repo: "ai",
  pat: properties.getProperty('pat'),
  email: "thelegendski@proton.me"
}

//grab file
function getFile (user, repo, file, branch) {
  try{
      const response = JSON.parse(UrlFetchApp.fetch(`https://api.github.com/repos/${user}/${repo}/contents/${file}${branch ? "?ref=" + branch : ""}`, {
        method: "get",
        headers: {
          "accept": "application/vnd.github+json",
          "authorization": `Bearer ${properties.getProperty("pat")}`,
          "X-GitHub-Api-Version": "2022-11-28"
        },
      }).getContentText())
      return response
  }catch(e){
    console.error(e)
    console.error(`${file} not found.`)
    return false
  }
}
//grab file contents
function getFileContents (user, repo, file, branch) {
  const cache = getFile(user, repo, file, branch)?.content
  return cache ? atob(cache) : "{\"empty\": true}"
}
//for the commit script
function getSHA (user, repo, file) {
  return getFile(user, repo, file)?.sha
}
//commit, :D!
function commitFile (user, repo, file, content, message, branch) {
  return JSON.parse(UrlFetchApp.fetch(`https://api.github.com/repos/${user.username}/${repo}/contents/${file}${branch ? "?ref=" + branch : ""}`, {
    method: "put",
    headers: {
      "accept": "application/vnd.github+json",
      "authorization": `Bearer ${properties.getProperty("pat")}`,
      "X-GitHub-Api-Version": "2022-11-28"
    },
    payload: JSON.stringify({
      "message": message,
      "committer": {
        "name": user.name,
        "email": user.email
      },
      "content": btoa(content),
      "sha": getSHA(user.username, repo, file)
    })
  }).getContentText()).commit.html_url
}

function commit(name, code) {
  console.log("commitin' code")
  const result = commitFile({ username: data.username, email: data.email, name: "ski" }, data.repo, name, code, "update from GAS at " + (new Date).toString()); 
  console.log("SUCCESS! commit can be found here: " + result);
}
