"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettingStore } from "@/store/setting";

interface SettingProps {
  open: boolean;
  onClose: () => void;
}

export default function Setting({ open, onClose }: SettingProps) {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    openaiApiKey,
    setOpenaiApiKey,
    anthropicApiKey,
    setAnthropicApiKey,
    googleApiKey,
    setGoogleApiKey,
    siliconflowApiKey,
    setSiliconflowApiKey,
    searchProvider,
    setSearchProvider,
    tavilyApiKey,
    setTavilyApiKey,
    serperApiKey,
    setSerperApiKey,
    exaApiKey,
    setExaApiKey,
  } = useSettingStore();

  const [localSettings, setLocalSettings] = useState({
    mode,
    openaiApiKey,
    anthropicApiKey,
    googleApiKey,
    siliconflowApiKey,
    searchProvider,
    tavilyApiKey,
    serperApiKey,
    exaApiKey,
  });

  const handleSave = () => {
    setMode(localSettings.mode);
    setOpenaiApiKey(localSettings.openaiApiKey);
    setAnthropicApiKey(localSettings.anthropicApiKey);
    setGoogleApiKey(localSettings.googleApiKey);
    setSiliconflowApiKey(localSettings.siliconflowApiKey);
    setSearchProvider(localSettings.searchProvider);
    setTavilyApiKey(localSettings.tavilyApiKey);
    setSerperApiKey(localSettings.serperApiKey);
    setExaApiKey(localSettings.exaApiKey);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">{t("setting.title")}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Provider Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("setting.aiProvider")}</CardTitle>
              <CardDescription>{t("setting.aiProviderDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("setting.selectProvider")}</Label>
                <Select
                  value={localSettings.mode}
                  onValueChange={(value: any) =>
                    setLocalSettings({ ...localSettings, mode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                    <SelectItem value="google">Google (Gemini)</SelectItem>
                    <SelectItem value="siliconflow">SiliconFlow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* OpenAI */}
              {localSettings.mode === "openai" && (
                <div className="space-y-2">
                  <Label>OpenAI API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={localSettings.openaiApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        openaiApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      OpenAI Platform
                    </a>
                  </p>
                </div>
              )}

              {/* Anthropic */}
              {localSettings.mode === "anthropic" && (
                <div className="space-y-2">
                  <Label>Anthropic API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-ant-..."
                    value={localSettings.anthropicApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        anthropicApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Anthropic Console
                    </a>
                  </p>
                </div>
              )}

              {/* Google */}
              {localSettings.mode === "google" && (
                <div className="space-y-2">
                  <Label>Google API Key</Label>
                  <Input
                    type="password"
                    placeholder="AIza..."
                    value={localSettings.googleApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        googleApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              )}

              {/* SiliconFlow */}
              {localSettings.mode === "siliconflow" && (
                <div className="space-y-2">
                  <Label>SiliconFlow API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={localSettings.siliconflowApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        siliconflowApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://siliconflow.cn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      SiliconFlow
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Provider Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("setting.searchProvider")}</CardTitle>
              <CardDescription>
                {t("setting.searchProviderDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("setting.selectSearchProvider")}</Label>
                <Select
                  value={localSettings.searchProvider}
                  onValueChange={(value: any) =>
                    setLocalSettings({ ...localSettings, searchProvider: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tavily">Tavily</SelectItem>
                    <SelectItem value="serper">Serper</SelectItem>
                    <SelectItem value="exa">Exa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tavily */}
              {localSettings.searchProvider === "tavily" && (
                <div className="space-y-2">
                  <Label>Tavily API Key</Label>
                  <Input
                    type="password"
                    placeholder="tvly-..."
                    value={localSettings.tavilyApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        tavilyApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://tavily.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Tavily
                    </a>
                  </p>
                </div>
              )}

              {/* Serper */}
              {localSettings.searchProvider === "serper" && (
                <div className="space-y-2">
                  <Label>Serper API Key</Label>
                  <Input
                    type="password"
                    placeholder="..."
                    value={localSettings.serperApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        serperApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://serper.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Serper
                    </a>
                  </p>
                </div>
              )}

              {/* Exa */}
              {localSettings.searchProvider === "exa" && (
                <div className="space-y-2">
                  <Label>Exa API Key</Label>
                  <Input
                    type="password"
                    placeholder="..."
                    value={localSettings.exaApiKey}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        exaApiKey: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("setting.getKeyFrom")}{" "}
                    <a
                      href="https://exa.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Exa
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-background border-t p-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("setting.cancel")}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t("setting.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
