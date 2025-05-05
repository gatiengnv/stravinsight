<?php

namespace App\Gemini\Client;

interface Gemini
{
    public function getOverviewDescription(): string;

    public function getChartsDescription(): string;

    public function getSplitDescription(): string;
}
