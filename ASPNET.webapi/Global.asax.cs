

using Newtonsoft.Json;
using System;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace WebAPISample
{
  public class WebApiApplication : System.Web.HttpApplication
    {
        private string[] technologies;

        protected void Application_Start()
            
        {
            
            GlobalConfiguration.Configure(WebApiConfig.Register);


            
            

        }

    }
}
