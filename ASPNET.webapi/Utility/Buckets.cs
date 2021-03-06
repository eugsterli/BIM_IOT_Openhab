﻿

using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace WebAPISample.Utility
{
  public static class Buckets
  {
    public enum Region
    {
      US,
      EMEA
    }

    public static bool IsValidBucketKey(string bucketKey)
    {
      Regex r = new Regex(@"^[a-z0-9\-_]+$", RegexOptions.IgnorePatternWhitespace);
      return r.IsMatch(bucketKey);
    }

    /// <summary>
    /// Get the MIME type for known industry files, such as Revit, AutoCAD, Inventor and Fusion. For other formats, use the standard application/EXTESION
    /// </summary>
    /// <param name="fileName">File name, with extension</param>
    /// <returns>MIME type string</returns>
    public static string MimeType(string fileName)
    {
      Dictionary<string, string> types = new Dictionary<string, string>();
      types.Add("png", "application/image");
      types.Add("jpg", "application/image");
      types.Add("txt", "application/txt");
      types.Add("ipt", "application/vnd.autodesk.inventor.part");
      types.Add("iam", "application/vnd.autodesk.inventor.assembly");
      types.Add("dwf", "application/vnd.autodesk.autocad.dwf");
      types.Add("dwg", "application/vnd.autodesk.autocad.dwg");
      types.Add("f3d", "application/vnd.autodesk.fusion360");
      types.Add("f2d", "application/vnd.autodesk.fusiondoc");
      types.Add("rvt", "application/vnd.autodesk.revit");
      string extension = Path.GetExtension(fileName).Replace(".", string.Empty);
      return (types.ContainsKey(extension) ? types[extension] : "application/" + extension);
    }

    /// <summary>
    /// Base64 encode a string (source: http://stackoverflow.com/a/11743162)
    /// </summary>
    /// <param name="plainText"></param>
    /// <returns></returns>
    public static string Base64Encode(this string plainText)
    {
      var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
      return System.Convert.ToBase64String(plainTextBytes);
    }

    /// <summary>
    /// Base64 dencode a string (source: http://stackoverflow.com/a/11743162)
    /// </summary>
    /// <param name="base64EncodedData"></param>
    /// <returns></returns>
    public static string Base64Decode(this string base64EncodedData)
    {
      var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
      return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }
  }
}