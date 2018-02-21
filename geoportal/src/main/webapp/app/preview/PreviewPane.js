/* See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Esri Inc. licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "app/preview/PreviewUtil",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/PreviewPane.html",
        "dojo/i18n!app/nls/resources",
        "esri/map"
      ], 
function(declare, lang, on, PreviewUtil, 
         _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, i18n,
         Map
         ) {

  var oThisClass = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

    i18n: i18n,
    templateString: template,
    
    postCreate: function() {
      this.inherited(arguments);
      
      // create map instance
      var mapProps = this.map || AppContext.appConfig.searchMap || {};
      if (mapProps) mapProps = lang.clone(mapProps);
      this.map = new Map(this.mapNode, mapProps);
      
      this.own(on(this.map, "update-start", lang.hitch(this, function() {
        esri.show(this.loading);
      })));
      
      this.own(on(this.map, "update-end", lang.hitch(this, function() {
        esri.hide(this.loading);
      })));
      
      // add service
      PreviewUtil.addService(this.map, this.serviceType);
    },
    
    destroy: function() {
      // make sure to destroy map instance
      this.map.destroy();
      this.inherited(arguments);
    }

  });

  return oThisClass;
});