

using Autodesk.Forge;
using System.Web.Configuration;

namespace WebAPISample
{
  internal class Config
  {
    /// <summary>
    /// The client ID of this app
    /// </summary>
    internal static string FORGE_CLIENT_ID { get { return GetAppSetting("FORGE_CLIENT_ID"); } }

    /// <summary>
    /// The client secret of this app
    /// </summary>
    internal static string FORGE_CLIENT_SECRET { get { return GetAppSetting("FORGE_CLIENT_SECRET"); } }

    /// <summary>
    /// List of scopes for internal use only (do not expose to public/endpoints)
    /// </summary>
    internal static Scope[] FORGE_SCOPE_INTERNAL
    {
      get
      {
        return new Scope[] { Scope.BucketRead, Scope.BucketCreate, Scope.DataRead };
      }
    }

    /// <summary>
    /// List of scopes for public use (in most cases, just data:read)
    /// </summary>
    internal static Scope[] FORGE_SCOPE_PUBLIC
    {
      get
      {
        return new Scope[] { Scope.DataRead };
      }
    }

    /// <summary>
    /// Read settings from web.config.
    /// See appSettings section for more details.
    /// </summary>
    /// <param name="settingKey"></param>
    /// <returns></returns>
    private static string GetAppSetting(string settingKey)
    {
      return WebConfigurationManager.AppSettings[settingKey];
    }

  }
}