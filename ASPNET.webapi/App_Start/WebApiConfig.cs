
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;


namespace WebAPISample
{
  public static class WebApiConfig
  {
    public class BrowserJsonFormatter : JsonMediaTypeFormatter
    {

            public BrowserJsonFormatter()
      {
        this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
      }

      public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
      {
        base.SetDefaultContentHeaders(type, headers, mediaType);
        headers.ContentType = new MediaTypeHeaderValue("application/json");

                

            }
    }

    public static void Register(HttpConfiguration config)
    {
      // Web API configuration and services
      config.Formatters.Add(new BrowserJsonFormatter()); // JSON by default
            
      // Web API routes
      config.MapHttpAttributeRoutes();

      config.Routes.MapHttpRoute(
          name: "ForgeOSSAPI",
          routeTemplate: "api/forge/{controller}",
          defaults: new { id = RouteParameter.Optional }
      );
      
    }
  }
}
