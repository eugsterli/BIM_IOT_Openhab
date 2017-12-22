

using Autodesk.Forge;
using Autodesk.Forge.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using WebAPISample.Utility;

namespace WebAPISample.Controllers
{
  public class JSTreeController : ApiController
  {
    public class TreeNode
    {
      public TreeNode(string id, string text, string type, bool children)
      {
        this.id = id;
        this.text = text;
        this.type = type;
        this.children = children;
      }

      public string id { get; set; }
      public string text { get; set; }
      public string type { get; set; }
      public bool children { get; set; }
    }

    [HttpGet]
    [Route("api/forge/tree")]
    public async Task<IList<TreeNode>> GetTreeDataAsync([FromUri]string id)
    {
      IList<TreeNode> nodes = new List<TreeNode>();
      dynamic oauth = await Utility.OAuth.Get2LeggedTokenAsync(new Scope[] { Scope.BucketRead, Scope.DataRead });

      if (id == "#") // root
      {
        // in this case, let's return all buckets
        BucketsApi appBckets = new BucketsApi();
        appBckets.Configuration.AccessToken = oauth.access_token;
        dynamic buckets = await appBckets.GetBucketsAsync(Enum.GetName(typeof(Utility.Buckets.Region), Utility.Buckets.Region.US), 100);
        foreach (KeyValuePair<string, dynamic> bucket in new DynamicDictionaryItems(buckets.items))
        {
          nodes.Add(new TreeNode(bucket.Value.bucketKey, bucket.Value.bucketKey, "bucket", true));
        }
      }
      else
      {
        // as we have the id (bucketKey), let's return all 
        ObjectsApi objects = new ObjectsApi();
        objects.Configuration.AccessToken = oauth.access_token;
        var objectsList = objects.GetObjects(id);
        foreach (KeyValuePair<string, dynamic> objInfo in new DynamicDictionaryItems(objectsList.items))
        {
          nodes.Add(new TreeNode(((string)objInfo.Value.objectId).Base64Encode(), objInfo.Value.objectKey, "object", false));
        }
      }
      return nodes;
    }
  }
}