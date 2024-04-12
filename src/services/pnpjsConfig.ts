import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import "@pnp/sp/batching";
import "@pnp/sp/items/get-all";
import { WebPartContext } from "@microsoft/sp-webpart-base";

var _sp: SPFI | null = null;

export const getWebPartSP = (context?: WebPartContext): SPFI => {
  if (context != null) {
    // Initialize PnP/SP for web parts
    _sp = spfi()
      .using(SPFx(context))
      .using(PnPLogging(LogLevel.Warning));
  }
  return _sp!;
};

export const getAppCustomizerSP = (context?: ApplicationCustomizerContext): SPFI => {
  if (context != null) {
    // Initialize PnP/SP for application customizers
    _sp = spfi()
      .using(SPFx(context))
      .using(PnPLogging(LogLevel.Warning));
  }
  return _sp!;
};


// import pnp and pnp logging system
// import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
// import { spfi, SPFI, SPFx } from "@pnp/sp";
// import { LogLevel, PnPLogging } from "@pnp/logging";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";
// import "@pnp/sp/batching";
// import { WebPartContext } from "@microsoft/sp-webpart-base";

// var _sp: SPFI | null = null;

// export const getSP = (context?: WebPartContext | ApplicationCustomizerContext): SPFI => {
//   if (context != null) {
//     //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
//     // The LogLevel set's at what level a message will be written to the console
//     _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
//   }
//   return _sp!;
// };

// import { WebPartContext, ApplicationCustomizerContext } from "@microsoft/sp-application-base";
// import { sp, SPFx } from "@pnp/sp";
// import { LogLevel, PnPLogging } from "@pnp/logging";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";
// import "@pnp/sp/batching";
// import "@pnp/sp/site-users/web";
// import "@pnp/sp/profiles";

// let _sp: sp | null = null;

// export const getSP = (context: WebPartContext | ApplicationCustomizerContext): sp => {
//   if (_sp === null) {
//     // Initialize SharePoint PnP context only once
//     if (context !== null) {
//       // Set the appropriate URL based on the context type
//       const siteUrl = context instanceof WebPartContext ? context.pageContext.web.absoluteUrl : context.site.absoluteUrl;

//       // Initialize PnP context with the URL and logging level
//       _sp = sp.setup({
//         sp: {
//           baseUrl: siteUrl,
//         },
//       }).using(PnPLogging(LogLevel.Warning));
//     }
//   }
  
//   return _sp!;
// };

