

using Autodesk.Forge;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebAPISample.Controllers
{
  public class OAuthController : ApiController
  {
    [HttpGet]
    [Route("api/forge/oauth/token")]
    public async Task<string> Get()
    {
      // only expose data:read access tokens as endpoints
      // this is required for Viewer
      dynamic oauth = await Utility.OAuth.Get2LeggedTokenAsync(new Scope[] { Scope.ViewablesRead });
      return oauth.access_token;
    }
  }
}